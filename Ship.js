var Ship = extend(Pawn, function Ship() {Pawn.apply(this, arguments)});

Ship.prototype.NODE_DISTANCE = 120;

Ship.prototype.nodes = [];

Ship.prototype.planet = undefined;

Ship.prototype.planetAngle = 0;
Ship.prototype.angle = 0;
Ship.prototype.mass = 10;

Ship.prototype.distanceTraveled = 0;
Ship.prototype.distanceSinceLastNode = 0;

Ship.prototype.image = images.ship;

Ship.prototype.tick = function(dt) {

		Pawn.prototype.tick.call(this,dt);

	if(this.planet == undefined){

		var dx = this.velocity.x * dt;
		var dy = this.velocity.y * dt;

		var dist = Math.sqrt((dx * dx) + (dy * dy));
		this.distanceTraveled += dist;
		this.distanceSinceLastNode += dist;

		if(this.distanceSinceLastNode >= this.NODE_DISTANCE){
			this.nodes.push(new RopeSegment(game, this.x, this.y));
			this.distanceSinceLastNode = 0;
		}

	} else {

		this.angle = this.planetAngle + this.planet.angle;
		this.x = this.planet.x + (Math.cos(this.angle) * this.planet.radius);
		this.y = this.planet.y + (Math.sin(this.angle) * this.planet.radius);

	}
}

Ship.prototype.draw = function(dt) {
	Pawn.prototype.draw.call(this, dt);
	this.game.ctx.drawImageRotated(this.image, this.x, this.y, this.angle);
}

Ship.prototype.fire = function(targetVelocity) {

	if(this.anchor == undefined)
		throw new Error('Not allowed to fire the ship while not attached to a planet!');

	this.velocity = { x: this.anchor.velocity.x, y: this.anchor.velocity.y }

	this.anchor = undefined;

	this.distanceTraveled = 0;

	var force = {x:targetVelocity * Math.cos(this.angle) * this.mass, y:targetVelocity * Math.sin(this.angle) * this.mass};

	this.addForce(force);
}

MixInto(Ship.prototype, Attachable);
