function Pawn(game, x, y) {
	if(!game || !game instanceof Game)
		throw new TypeError("Game isn't right.");

	this.game = game;

	this.game.addPawn(this);

	this.createBody(x, y);
}

Pawn.prototype.tick = function(dt) {
	//does nothing
}

Pawn.prototype.createBody = function() {
	throw new Error("You must implement createBody to extend pawn");
}

Pawn.prototype.draw = function(dt) {
	//does nothing
}

Pawn.prototype.destructor = function() {
	this.game.removePawn(this);
	this.game.DestroyBody(this.body);
}

Pawn.prototype.distanceTo = function(other) {
	var here = this.getPosition();
	var there = other.getPosition();
	return Math.sqrt(Math.pow(here.x - there.x, 2) + Math.pow(here.y - there.y, 2)); 
}

Pawn.prototype.getPosition = function() {
	return this.body.GetWorldCenter();
}

Pawn.prototype.getAngle = function() {
	return this.body.GetAngle();
}

Pawn.prototype.directionTo = function(other) {
	var here = this.getPosition();
	var there = other.getPosition();
	return RectangularToPolar(there.x - here.x, there.y - here.y);
}

types[Pawn.name] = Pawn;
