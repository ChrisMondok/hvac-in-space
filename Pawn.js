function Pawn(game, x, y) {
	if(!game || !game instanceof Game)
		throw new TypeError("Game isn't right.");

	if(typeof(x) != "number" || typeof(y) != "number")
		throw new TypeError("You need to define x and y!");

	this.game = game;
	this.x = x;
	this.y = y;

	this.game.pawns.push(this);

	this.velocity = {x: 0, y: 0};
}

Pawn.prototype.tick = function(dt) {
	this.x += this.velocity.x;
	this.y += this.velocity.y;
}

Pawn.prototype.draw = function(dt) {
	//does nothing
}

Pawn.prototype.destructor = function() {
	this.game.pawns.splice(this.game.pawns.indexOf(this), 1);
}

Pawn.prototype.addForce = function(force) {
	this.velocity.x += force.x / this.mass;
	this.velocity.y += force.y / this.mass;
}
