var Ship = extend(Pawn, function Ship() {Pawn.apply(this, arguments)});

Ship.prototype.NODE_DISTANCE = 12;

Ship.prototype.nodes = [];

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
		var dx = this.velocity.x * dt;
		var dy = this.velocity.y * dt;

		var dist = Math.sqrt((dx * dx) + (dy * dy));
		this.distanceTraveled += dist;
		this.distanceSinceLastNode += dist;

		if(this.distanceSinceLastNode >= this.NODE_DISTANCE){
			this.nodes.push(new RopeSegment(game, this.x, this.y));
			this.distanceSinceLastNode = 0;
		}

		this.beAffectedByGravity(dt);
	}
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
	this.detatch();

	this.distanceTraveled = 0;

	var force = PolarToRectangular(this.angle, targetVelocity);

	this.addForce(force);
}

MixInto(Ship.prototype, Attachable);
