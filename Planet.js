var Planet = extend(Pawn, function Planet() {Pawn.apply(this, arguments)});

Planet.prototype.mass = 1000;

Planet.prototype.image = images.bluePlanet;

Planet.prototype.radius = 100;

Planet.prototype.cluster = null;

Planet.prototype.getGravity = function(dt, otherPlanet) {
	if(!(this.mass && otherPlanet.mass))
		throw new RangeError('Both bodies must have mass!');

	var magnitude =  dt * this.game.CONSTANT_OF_GRAVITY * (this.mass * otherPlanet.mass) / Math.pow(this.distanceTo(otherPlanet),2);
	var direction = this.directionTo(otherPlanet);

	return PolarToRectangular(direction, magnitude);
}

Planet.prototype.draw = function(dt) {
	Pawn.prototype.draw.call(this, dt);

	var ctx = this.game.ctx;
	ctx.drawImageRotated(this.image, this.x, this.y, this.angle);
}

Planet.prototype.addForce = function() {
	if(this.cluster)
		this.cluster.addForce.apply(this.cluster, arguments);
	else
		Pawn.prototype.addForce.apply(this, arguments);
}

Planet.prototype.orbitBody = function(otherBody, clockwise) {
	this.velocity.x = otherBody.velocity.x;
	this.velocity.y = otherBody.velocity.y;

	var targetVelocity = Math.sqrt( game.CONSTANT_OF_GRAVITY * (this.mass + otherBody.mass) / this.distanceTo(otherBody));
	var forceDirection = this.directionTo(otherBody);
	if(clockwise)
		forceDirection += Math.PI/2;
	else
		forceDirection -= Math.PI/2;

	var force = PolarToRectangular(forceDirection, targetVelocity * this.mass);
	this.addForce(force);
	otherBody.addForce({x:force.x * -1, y:force.y * -1});
}

Planet.prototype.interpolateAngle = function(angle, amount) {
	if(this.interpAngleStart === undefined)
		this.interpAngleStart = this.angle;

	var actual = (angle + Math.PI * 2) % (2 * Math.PI);
	if(actual > Math.PI)
		actual -= 2 * Math.PI;
	this.angle = this.interpAngleStart + actual * amount;	
}
