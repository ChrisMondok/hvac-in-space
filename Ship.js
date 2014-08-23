var Ship = extend(Pawn, function Ship() {Pawn.apply(this, arguments)});

Ship.prototype.planet = undefined;

Ship.prototype.planetAngle = 0;
Ship.prototype.angle = 0;
Ship.prototype.mass = 10;

Ship.prototype.image = images.ship;

Ship.prototype.tick = function(dt) {

		Pawn.prototype.tick.call(this,dt);

	if(this.planet == undefined){
	
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

Ship.prototype.attachToPlanet = function(planet) {
	this.planet = planet;
	this.velocity = {x:0, y:0};
}

Ship.prototype.fire = function(targetVelocity) {

	this.planet = undefined;

	var force = {x:targetVelocity * Math.cos(this.angle) * this.mass, y:targetVelocity * Math.sin(this.angle) * this.mass};
	this.addForce(force);
}
