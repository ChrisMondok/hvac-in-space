var keyOrder = [90, 88, 67, 86];
var keyIndex = 0;

var Ship = extend(Pawn, function Ship() {
	Pawn.apply(this, arguments)
	this.nodes = [];
	this.winching = false;

	this.keyDownListener = this.keyHandler.bind(this, true);
	this.keyUpListener = this.keyHandler.bind(this, false);

	document.addEventListener('keydown', this.keyDownListener);
	document.addEventListener('keyup', this.keyUpListener);

	this.charge = 0;
	this.charging = false;

	this.lastWinchKey = 86;

	this.desiredRotation = 0;
});

Ship.prototype.NODE_DISTANCE = 64;
Ship.prototype.MAX_SPEED = 800;
Ship.prototype.ROPE_TENSIONING_DELAY = 1;
Ship.prototype.GRAVITY_FUDGE_FACTOR = 2500;
Ship.prototype.WINCH_TICK_AMOUNT = 25;
Ship.prototype.MANUAL_ROTATION_SPEED = Math.PI/3;

Ship.prototype.planet = undefined;

Ship.prototype.planetAngle = 0;
Ship.prototype.angle = 0;
Ship.prototype.mass = 1;

Ship.prototype.distanceSinceLastNode = 0;

Ship.prototype.image = images.ship;

Ship.prototype.focalDistance = 0;
Ship.prototype.wheelAngle = 0;

Ship.prototype.timeBetweenParticles = 1000;

Ship.prototype.tick = function(dt) {
	Pawn.prototype.tick.call(this,dt);

	this.collide(this.checkForCollisions());

	if(this.anchor) {
		if(this.nodes.length) {
			this.interpolateNodes(dt);
			this.interpolatePlanets(dt);

			this.otherPlanet.angularVelocity = 0;
			this.anchor.angularVelocity = 0;
		}

		if(this.charging) {
			this.charge += dt/2;
			if(this.charge > 1) {
				this.charging = false;
				this.charge = 0;
			}
		}
		else {
			if(this.charge) {
				this.fire(this.charge * this.MAX_SPEED);
				this.chargeSound.stop();
			}
		}

		if(this.otherPlanet) {
			if(this.anchor.cluster && this.anchor.cluster == this.otherPlanet.cluster) {
				this.winching = false;
				this.otherPlanet = null;
			}
		} else {
			this.anchorAngle += this.desiredRotation * dt;
		}
	}
	else {
		this.charge = 0;
		if(this.nodes.length){
			if(this.weAreTooFarFromThePreviousNode()) {
				playSound(sounds.winchLettingOut);
				this.nodes.push(new RopeSegment(game, this.x, this.y));
			}
		}

		this.beAffectedByGravity(dt);

		this.adjustRopeInSpace(dt);

		this.emitParticles(dt);
	}

	if(this.winching) {
		var currentDistance = this.anchor.distanceTo(this.otherPlanet);

		var anchorAdjust = PolarToRectangular(this.anchor.directionTo(this.otherPlanet), dt * (currentDistance - this.winchLength) / 2);

		this.anchor.x += anchorAdjust.x;
		this.anchor.y += anchorAdjust.y;

		this.otherPlanet.x -= anchorAdjust.x;
		this.otherPlanet.y -= anchorAdjust.y;
	}
}

//NOTE! This should be idempotent.
Ship.prototype.keyHandler = function(down, keyEvent) {
	var code = keyEvent.which || keyEvent.keyCode;
	switch(code) {
	case 32:
		if(this.anchor && !this.otherPlanet) {
			if(down) {
				if(!this.charging) {
					this.charging = true;
					this.chargeSound = playSound(sounds.charging);
				}
			}
			else
				this.charging = false;
		}
		break;
	case 37:
			this.desiredRotation = down ?  this.MANUAL_ROTATION_SPEED : 0;
		break;
	case 39:
			this.desiredRotation = down ? -this.MANUAL_ROTATION_SPEED : 0;
		break;
	default:
		if(this.winching && code == keyOrder[keyIndex % 4]) {
			playSound(sounds.winchPullingIn);
			this.winchTick();
			keyIndex++;
		}
	}
}

Ship.prototype.winchTick = function() {
	this.winchLength -= this.WINCH_TICK_AMOUNT;
}

Ship.prototype.attachTo = function(anchor) {
	if(this.nodes.length) {
		this.otherPlanet = this.nodes[0].anchor;

		if(this.otherPlanet == anchor || ( anchor.cluster && this.otherPlanet.cluster == anchor.cluster)) {
			this.otherPlanet = null;
			this.destroyRope();
		}
		else {
			this.ropeDelayRemaining = this.ROPE_TENSIONING_DELAY;
			var toDelete = 0;
			for(var i = 0; i < this.nodes.length; i++) {
				if(this.nodes[i+1] && this.nodes[i+1].anchor)
					toDelete++;
			}

			while(toDelete) {
				toDelete--;
				this.nodes.shift().destructor();
			}

			this.otherPlanet.interpAngleStart = anchor.interpAngleStart = undefined;

			this.anchorRotationOffset =  anchor.directionTo(this.otherPlanet) - anchor.directionTo(this);
			this.otherPlanetRotationOffset =  this.otherPlanet.directionTo(anchor) - this.otherPlanet.directionTo(this.nodes[0]);
		}
	}
	else
		this.otherPlanet = null;
}

Ship.prototype.interpolateNodes = function(dt) {
	this.ropeDelayRemaining -= dt;
	if(this.ropeDelayRemaining < 0) {
		this.destroyRope();
		this.winching = true;
		this.winchLength = this.otherPlanet.distanceTo(this.anchor);
	}
	for(var i = 0; i < this.nodes.length; i++) {
		var amount = 1 - (this.ropeDelayRemaining / this.ROPE_TENSIONING_DELAY);
		var targetForNode = InterpolatePositions(this.nodes[0], this, i / this.nodes.length);
		this.nodes[i].interpolateTo(targetForNode, amount);
		
	}
	this.emitParticles(dt);
}

Ship.prototype.interpolatePlanets = function(dt) {
	var amount = 1 - (this.ropeDelayRemaining / this.ROPE_TENSIONING_DELAY);
	this.otherPlanet.interpolateAngle(this.otherPlanetRotationOffset, amount);
	this.anchor.interpolateAngle(this.anchorRotationOffset, amount);
}

Ship.prototype.adjustRopeInSpace = function() {
	for(var i = 1; i < this.nodes.length; i++)
	{
		thisNode = this.nodes[i];
		var previousNode = this.nodes[i-1];

		if(thisNode.anchor && thisNode.anchor != this.nodes[0].anchor) {
			this.destroyRope();
			playSound(sounds.ropeSnap);
			break;
		}

		if(thisNode.distanceTo(previousNode) > this.NODE_DISTANCE) {
			var direction = previousNode.directionTo(thisNode);
			var offset = PolarToRectangular(direction, this.NODE_DISTANCE);


			thisNode.x = previousNode.x + offset.x;
			thisNode.y = previousNode.y + offset.y;
		}
	}
}

Ship.prototype.destroyRope = function() {
	while(this.nodes.length) {
		this.nodes.pop().destructor();
	}
}

Ship.prototype.weAreTooFarFromThePreviousNode = function() {
	var lastNode = this.nodes[this.nodes.length - 1];
	return this.distanceTo(lastNode) > this.NODE_DISTANCE;
}

Ship.prototype.destructor = function() {
	document.removeEventListener('keydown', this.keyDownListener);
	document.removeEventListener('keyup', this.keyUpListener);

	Pawn.prototype.destructor.apply(this, arguments);

	this.nodes.forEach(function(n) { n.destructor(); });
}

Ship.prototype.beAffectedByGravity = function(dt) {
	var planets = game.instances[Planet.name];
	var force = {x: 0, y: 0};

	for(var i = 0; i < planets.length; i++) {
		var magnitude = this.GRAVITY_FUDGE_FACTOR * dt * (game.CONSTANT_OF_GRAVITY * planets[i].mass)/Math.pow(planets[i].distanceTo(this), 2);
		var direction = this.directionTo(planets[i]);
		
		var rect = PolarToRectangular(direction, magnitude);
		force.x += rect.x;
		force.y += rect.y;
	}

	this.addForce(force);
};

Ship.prototype.draw = function(dt) {
	Pawn.prototype.draw.call(this, dt);

	var ctx = this.game.ctx;

	this.drawWheel(dt);

	if(this.nodes.length)
		this.drawRope(dt);
	if(this.winching)
		this.drawWinch(dt);

	var img = this.getImage();

	ctx.drawImageRotated(img, this.x, this.y, this.angle);

	ctx.lineWidth = 12;
	ctx.strokeStyle = 'white';
	ctx.beginPath();
	if(this.charge)
		ctx.arc(this.x, this.y, 48, - Math.PI/2, - Math.PI/2 + Math.PI * 2 * this.charge, false);	
	ctx.stroke();
}

Ship.prototype.getImage = function() {
	
	if(Math.sin(this.angle) > Math.sin(Math.PI / 4))
		return images.shipTop;

	if(Math.cos(this.angle) > 0)
		return images.shipRight;
	else
		return images.shipLeft;
}

Ship.prototype.drawWheel = function(dt) {

	if(Math.sin(this.angle) > Math.sin(Math.PI / 4))
		return;

	if(Math.cos(this.angle) > 0)
		var offset = {x:-13, y:-21};
	else
		var offset = {x:-13, y:21};
	var wheelImage = images.wheel;
	this.wheelAngle += (dt);
	var dir = RectangularToPolar(offset.x, offset.y) + this.angle;
	
	offset = PolarToRectangular(dir, Magnitude(offset.x, offset.y));

	this.game.ctx.drawImageRotated(wheelImage, this.x + offset.x, this.y + offset.y, this.wheelAngle + this.angle);
}

Ship.prototype.drawRope = function(dt) {
	var ctx = this.game.ctx;
	ctx.strokeStyle = '#FFFFFF';
	ctx.lineCap = 'round';
	ctx.lineJoin = 'round';
	ctx.lineWidth = 8;
	ctx.beginPath();
	this.nodes.forEach(function(n) { ctx.lineTo(n.x, n.y); });
	ctx.lineTo(this.x, this.y);
	ctx.stroke();
}

Ship.prototype.drawWinch = function(dt) {
	var ctx = this.game.ctx;
	ctx.lineWidth = 8;
	ctx.lineCap = 'butt';

	ctx.strokeStyle = 'white';

	var angle, offset;

	ctx.beginPath();
		angle = this.anchor.directionTo(this.otherPlanet);
		offset = PolarToRectangular(angle, this.anchor.radius);
		ctx.moveTo(this.anchor.x + offset.x, this.anchor.y + offset.y);

		angle += Math.PI;
		offset = PolarToRectangular(angle, this.otherPlanet.radius);
		ctx.lineTo(this.otherPlanet.x + offset.x, this.otherPlanet.y + offset.y);
	ctx.stroke();

}

Ship.prototype.fire = function(targetVelocity) {
	var node = new RopeSegment(game, this.x, this.y);
	this.winching = false;
	node.attachTo(this.anchor);

	this.nodes.push(node);

	this.detatch();

	this.otherPlanet = null;

	playSound(sounds.liftoff);

	this.angularVelocity = 0;

	var force = PolarToRectangular(this.angle, targetVelocity);

	this.addForce(force);
}

Ship.prototype.checkForCollisions = function () {
	if(this.anchor)
		return;
	var planets = this.game.getPlanets();
	for(var i=0; i<planets.length; i++){
		if (this.distanceTo(planets[i]) < planets[i].radius - 1)
			return planets[i];
	};
}

Ship.prototype.collide = function(planet) {
	if (planet == null) return;

	playSound(sounds.landing);

	this.attachTo(planet);
}

Ship.prototype.emitParticles = function(dt) {
		this.timeBetweenParticles -= dt * 10000;
		if (this.timeBetweenParticles < 0){
			this.timeBetweenParticles += 1000;
			new Particle(
					game, 
					Particle.linearFade, 
					{
						x:this.x, 
						y:this.y
					}, 
					{
						x:(-1 * dt * this.velocity.x/6) + Math.random()*.3 - .15, 
						y:(-1 * dt * this.velocity.y/6) + Math.random()*.3 - .15
					}, 
					1,
					{
						color:'hsl(' + Math.floor(Math.random()*50+130) + ', 100%, 50%)',
						radius:10
					}
			);
		}
}
MixInto(Ship.prototype, Attachable);
