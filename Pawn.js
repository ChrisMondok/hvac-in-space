function Pawn(game, x, y) {
	if(!game || !game instanceof Game)
		throw new TypeError("Game isn't right.");

	this.game = game;
	this.x = x || 0;
	this.y = y || 0;

	this.velocity = {x: 0, y: 0};
	this.angle = 0;

	this.game.addPawn(this);
}

Pawn.prototype.angularVelocity = 0;

Pawn.prototype.tick = function(dt) {
	this.x += this.velocity.x * dt;
	this.y += this.velocity.y * dt;
	this.angle += this.angularVelocity * dt;
}

Pawn.prototype.draw = function(dt) {
	//does nothing
}

Pawn.prototype.destructor = function() {
	this.game.removePawn(this);
}

Pawn.prototype.distanceTo = function(otherPlanet) {
	return Math.sqrt(Math.pow(this.x - otherPlanet.x, 2) + Math.pow(this.y - otherPlanet.y, 2)); 
}

Pawn.prototype.directionTo = function(otherPlanet) {
	return Math.atan2( otherPlanet.y - this.y, otherPlanet.x - this.x );
}

Pawn.prototype.addForce = function(force) {
	this.velocity.x += force.x / this.mass;
	this.velocity.y += force.y / this.mass;
}

types[Pawn.name] = Pawn;
