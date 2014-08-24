var Ship = extend(Pawn, function Ship() {
	Pawn.apply(this, arguments)
	this.nodes = [];
});

Ship.prototype.NODE_DISTANCE = 64;

Ship.prototype.ROPE_TENSIONING_DELAY = 10;

Ship.prototype.planet = undefined;

Ship.prototype.distanceTraveled = 0;
Ship.prototype.distanceSinceLastNode = 0;

Ship.prototype.weld = null;

Ship.prototype.image = images.ship;

Ship.prototype.focalDistance = 0;

Ship.prototype.tick = function(dt) {
	Pawn.prototype.tick.call(this,dt);

	//this.collide(this.checkForCollisions());

	return;

	if(this.anchor) {
		if(this.nodes.length) {
			this.interpolateNodes(dt);

			this.otherPlanet.angularVelocity = 0;
			this.anchor.angularVelocity = 0;

			var anchorRotationOffset =  this.anchor.directionTo(this.otherPlanet) - this.anchor.directionTo(this);
			var otherPlanetRotationOffset =  this.otherPlanet.directionTo(this.anchor) - this.otherPlanet.directionTo(this.nodes[0]);

			debugger;

			this.anchor.angle += anchorRotationOffset;
			//this.otherPlanet.angle += otherPlanetRotationOffset;

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
}

Ship.prototype.attachTo = function(anchor) {
	var angle = anchor.directionTo(this);
	var offset = PolarToRectangular(angle, anchor.radius + 10);
	var planetPosition = anchor.getPosition();
	var position = new b2Vec2(planetPosition.x + offset.x, planetPosition.y + offset.y);
	this.body.SetPositionAndAngle(position, angle);

	var jointDef = new Box2D.Dynamics.Joints.b2WeldJointDef;

	jointDef.Initialize(this.body, anchor.body, new b2Vec2(0, 0));

	//jointDef.collideConnected = true;

	this.weld = game.world.CreateJoint(jointDef);

	return;

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

//		this.anchorRotationOffset =  anchor.directionTo(this.otherPlanet) - anchor.directionTo(this);
//		this.otherPlanetRotationOffset =  this.otherPlanet.directionTo(anchor) - this.otherPlanet.directionTo(this.nodes[0]);
//		this.otherPlanet.angularVelocity = 0;
//		anchor.angularVelocity = 0;
//
//		anchor.angle += this.anchorRotationOffset;
//		this.otherPlanet.angle += this.otherPlanetRotationOffset;
	}
	else
		this.otherPlanet = null;
}

Ship.prototype.interpolateNodes = function(dt) {
	this.ropeDelayRemaining -= dt;
	if(this.ropeDelayRemaining < 0) {
		this.destroyRope();
	}
	for(var i = 0; i < this.nodes.length; i++) {
		var amount = 1 - (this.ropeDelayRemaining / this.ROPE_TENSIONING_DELAY);
		var targetForNode = InterpolatePositions(this.nodes[0], this, i / this.nodes.length);
		this.nodes[i].interpolateTo(targetForNode, amount);
		
	}
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

	return;

	this.addForce(force);
};

Ship.prototype.draw = function(dt) {
	Pawn.prototype.draw.call(this, dt);

	var position = this.getPosition();
	this.game.ctx.drawSprite(this.image, position.x, position.y, this.getAngle());

	return;

	if(this.nodes.length)
		this.drawRope(dt);
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
	this.game.world.DestroyJoint(this.weld);
	this.weld = null;

	var force = PolarToRectangular(this.getAngle(), targetVelocity);
	this.body.ApplyImpulse(force, this.getPosition());

	this.body.SetAngularVelocity(0);
	return;
	var node = new RopeSegment(game, this.x, this.y);
	node.attachTo(this.anchor);

	this.nodes.push(node);

	this.detatch();

	this.distanceTraveled = 0;

	var force = PolarToRectangular(this.angle, targetVelocity);

	this.addForce(force);
}

Ship.prototype.checkForCollisions = function () {

	var planets = this.game.getPlanets();
	for(var i=0; i<planets.length; i++){
		if (this.distanceTo(planets[i]) < planets[i].radius - 1)
			return planets[i];
	};
}

Ship.prototype.createBody = function(x, y) {
	var fixDef = new b2FixtureDef();
	fixDef.density = 0.1;
	fixDef.friction = 0.5;
	fixDef.restitution = 0.2;

	fixDef.shape = new b2CircleShape(10);

	var bodyDef = new b2BodyDef();
	bodyDef.type = b2Body.b2_dynamicBody;
	bodyDef.position.x = x;
	bodyDef.position.y = y;
	
	this.body = this.game.world.CreateBody(bodyDef);
	this.fixture = this.body.CreateFixture(fixDef);
}

//Ship.prototype.collide = function(planet) {
//	if (planet == null) return;
//	this.attachTo(planet);
//}
