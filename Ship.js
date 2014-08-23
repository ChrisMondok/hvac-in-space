var Ship = extend(Pawn);

Ship.prototype.planet = undefined;

Ship.prototype.planetAngle = 0;

Ship.prototype.image = images.ship;

Ship.prototype.tick = function(dt) {

	if(this.planet == undefined){
		/* logic! */
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
