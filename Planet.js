var Planet = extend(Pawn);

Planet.prototype.mass = 1000;

Planet.prototype.image = images.bluePlanet;

Planet.prototype.getGravity = function(otherPlanet) {

	var magnitude =  this.game.CONSTANT_OF_GRAVITY * (this.mass * otherPlanet.mass) / Math.pow(this.distanceTo(otherPlanet),2);
	var direction = this.directionTo(otherPlanet);

	return {y:magnitude * Math.sin(direction), x:magnitude * Math.cos(direction)}
}

Planet.prototype.draw = function(dt) {
	Pawn.prototype.draw.call(this, dt);

	this.game.ctx.drawImage(this.image, this.x - this.image.width / 2, this.y - this.image.height / 2);
}

Planet.prototype.distanceTo = function(otherPlanet) {
	return Math.sqrt(Math.pow(this.x - otherPlanet.x, 2) + Math.pow(this.y - otherPlanet.y, 2)); 
}

Planet.prototype.directionTo = function(otherPlanet) {
	return Math.atan2( otherPlanet.y - this.y, otherPlanet.x - this.x );
}
