var Ship = extend(Pawn, function Ship() {
	Pawn.apply(this, arguments)
	this.nodes = [];
	this.winching = false;
});

Ship.prototype.NODE_DISTANCE = 64;

Ship.prototype.ROPE_TENSIONING_DELAY = 1;

Ship.prototype.planet = undefined;

Ship.prototype.planetAngle = 0;
Ship.prototype.angle = 0;
Ship.prototype.mass = 1;

Ship.prototype.distanceSinceLastNode = 0;

Ship.prototype.image = images.ship;

Ship.prototype.focalDistance = 0;
Ship.prototype.wheelAngle = 0;

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
	}
	else {
		if(this.nodes.length){
			if(this.weAreTooFarFromThePreviousNode())
				this.nodes.push(new RopeSegment(game, this.x, this.y));
		}

		this.beAffectedByGravity(dt);

		this.adjustRopeInSpace(dt);
	}

	if(this.winching) {
		var forceDirection = this.anchor.directionTo(this.otherPlanet);
		var forceMagnitude = 10000 * dt;
		this.anchor.addForce(PolarToRectangular(forceDirection, forceMagnitude));
		this.otherPlanet.addForce(PolarToRectangular(forceDirection + Math.PI, forceMagnitude));
	}
}

Ship.prototype.attachTo = function(anchor) {
	if(this.nodes.length) {
		this.otherPlanet = this.nodes[0].anchor;
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
	else
		this.otherPlanet = null;
}

Ship.prototype.interpolateNodes = function(dt) {
	this.ropeDelayRemaining -= dt;
	if(this.ropeDelayRemaining < 0) {
		this.destroyRope();
		this.winching = true;
	}
	for(var i = 0; i < this.nodes.length; i++) {
		var amount = 1 - (this.ropeDelayRemaining / this.ROPE_TENSIONING_DELAY);
		this.winching = true;
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
	Pawn.prototype.destructor.apply(this, arguments);
	this.nodes.forEach(function(n) {
		n.destructor();
	});
}

Ship.prototype.beAffectedByGravity = function(dt) {
	var planets = game.instances[Planet.name];
	var force = {x: 0, y: 0};
	
	for(var i = 0; i < planets.length; i++) {
		var magnitude = dt * (game.CONSTANT_OF_GRAVITY * planets[i].mass)/Math.pow(planets[i].distanceTo(this), 2);
		var direction = this.directionTo(planets[i]);
		
		var rect = PolarToRectangular(direction, magnitude);
		force.x += rect.x;
		force.y += rect.y;
	}

	this.addForce(force);
};

Ship.prototype.draw = function(dt) {
	Pawn.prototype.draw.call(this, dt);

	this.drawWheel(dt);
	this.game.ctx.drawImageRotated(this.image, this.x, this.y, this.angle);

	if(this.nodes.length)
		this.drawRope(dt);
}

Ship.prototype.drawWheel = function(dt) {
	var wheelImage = images.wheel;
	this.wheelAngle += (dt);
	var offset = {
		x:-13,
		y:-21
	}
	var dir = RectangularToPolar(offset.x, offset.y) + this.angle;
	
	offset = PolarToRectangular(dir, Magnitude(offset.x, offset.y));

	this.game.ctx.drawImageRotated(wheelImage, this.x + offset.x, this.y + offset.y, this.wheelAngle);
}

Ship.prototype.drawRope = function(dt) {
	var ctx = this.game.ctx;
	ctx.strokeStyle = '#FFFFFF';
	ctx.lineCap = 'roudn';
	ctx.lineJoin = 'round';
	ctx.lineWidth = 8;
	ctx.beginPath();
	this.nodes.forEach(function(n) { ctx.lineTo(n.x, n.y); });
	ctx.lineTo(this.x, this.y);
	ctx.stroke();
}

Ship.prototype.fire = function(targetVelocity) {
	var node = new RopeSegment(game, this.x, this.y);
	this.winching = false;
	node.attachTo(this.anchor);

	this.nodes.push(node);

	this.detatch();

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

	this.attachTo(planet);
}

Ship.prototype.emitParticles = function(dt) {
		this.timeBetweenParticles -= dt * 10000;
		if (this.timeBetweenParticles < 0){
			this.timeBetweenParticles += 1000;
			new Particle(
					game, 
					Particle.linearFade, 
					{x:this.x - 5, y:this.y - 5}, 
					{x:-1, y:Math.random()*.3 - 0.15}, 
					1
			);
		}
}
MixInto(Ship.prototype, Attachable);
