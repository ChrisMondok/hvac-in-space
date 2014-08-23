var Ship = extend(Pawn);

Ship.prototype.planet = undefined;

Ship.prototype.planetAngle = 0;
Ship.prototype.angle = 0;

Ship.prototype.image = images.ship;

Ship.prototype.tick = function(dt) {

	if(this.planet == undefined){
		/* logic! */
	} else {

		this.angle = this.planetAngle + this.planet.rotationAngle;
		this.x = this.planet.x + (Math.cos(this.angle) * this.planet.radius);
		this.y = this.planet.y + (Math.sin(this.angle) * this.planet.radius);

	}
}

Ship.prototype.draw = function(dt) {

	Pawn.prototype.draw.call(this, dt);
	var ctx = this.game.ctx;
	ctx.save();
	ctx.translate(this.x, this.y);
	ctx.rotate(this.angle);
	ctx.drawImage(this.image, 0, 0);
	ctx.restore();
}
