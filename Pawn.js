function Pawn(game, x, y) {
	if(!game || !game instanceof Game)
		throw new TypeError("Game isn't right.");

	this.game = game;
	this.x = x || 0;
	this.y = y || 0;

	this.velocity = {x: 0, y: 0};
	this.angle = 0;

	this.game.pawns.push(this);
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
	this.game.pawns.splice(this.game.pawns.indexOf(this), 1);
}

Pawn.prototype.addForce = function(force) {
	this.velocity.x += force.x / this.mass;
	this.velocity.y += force.y / this.mass;
}
