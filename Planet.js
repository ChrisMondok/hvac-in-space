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

Planet.prototype.orbitBody = function(otherBody, clockwise) {
	
	var targetVelocity = Math.sqrt( game.CONSTANT_OF_GRAVITY * (this.mass + otherBody.mass) / this.distanceTo(otherBody));
	var forceDirection = this.directionTo(otherBody);
	if(clockwise)
		forceDirection += Math.PI/2;
	else
		forceDirection -= Math.PI/2;

	var force = {x:targetVelocity * Math.cos(forceDirection) * this.mass, y:targetVelocity * Math.sin(forceDirection) * this.mass};
	this.addForce(force);
	otherBody.addForce({x:force.x * -1, y:force.y * -1});
}
