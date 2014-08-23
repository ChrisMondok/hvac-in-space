var Ship = extend(Pawn, function Ship() {
	Pawn.apply(this, arguments)
	this.nodes = [];
});

Ship.prototype.NODE_DISTANCE = 120;

Ship.prototype.planet = undefined;

Ship.prototype.planetAngle = 0;
Ship.prototype.angle = 0;
Ship.prototype.mass = 1;

Ship.prototype.distanceTraveled = 0;
Ship.prototype.distanceSinceLastNode = 0;

Ship.prototype.image = images.ship;

Ship.prototype.tick = function(dt) {
	Pawn.prototype.tick.call(this,dt);

	if(!this.anchor){
		if(this.weAreTooFarFromThePreviousNode())
			this.nodes.push(new RopeSegment(game, this.x, this.y));

		this.beAffectedByGravity(dt);
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

	//this works because we're treating mass as 1. I think.
	this.velocity.x += force.x;
	this.velocity.y += force.y;
};

Ship.prototype.draw = function(dt) {
	Pawn.prototype.draw.call(this, dt);
	this.game.ctx.drawImageRotated(this.image, this.x, this.y, this.angle);
}

Ship.prototype.fire = function(targetVelocity) {
	var node = new RopeSegment(game, this.x, this.y);
	node.attachTo(this.anchor);

	this.nodes.push(node);

	this.detatch();

	this.distanceTraveled = 0;

	var force = PolarToRectangular(this.angle, targetVelocity);

	this.addForce(force);
}

MixInto(Ship.prototype, Attachable);
