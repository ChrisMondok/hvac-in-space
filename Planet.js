var Planet = extend(Pawn);

Planet.prototype.x;

Planet.prototype.y;

Planet.prototype.getGravity = function(otherPlanet) {

	var magnitude =  this.game.CONSTANT_OF_GRAVITY * (this.mass * otherPlanet.mass) / Math.pow(this.distanceTo(otherPlanet),2);
	var direction = this.directionTo(otherPlanet);

	return {y:magnitude * Math.sin(direction), x:magnitude * Math.cos(direction)}
}

Planet.prototype.distanceTo = function(otherPlanet) {
	return Math.sqrt(Math.pow(this.x - otherPlanet.x, 2) + Math.pow(this.y - otherPlanet.y, 2)); 
}

Planet.prototype.directionTo = function(otherPlanet) {
	return Math.atan2( otherPlanet.y - this.y, this.x - otherPlanet.x);
}
