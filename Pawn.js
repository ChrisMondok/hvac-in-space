function Pawn(game) {
	if(!game || !game instanceof Game)
		throw new TypeError("Game isn't right.");

	this.game = game;

	this.game.pawns.push(this);
}

Pawn.prototype.tick = function(dt) {
	//override this
}

Pawn.prototype.destructor = function() {
	this.game.pawns.splice(this.game.pawns.indexOf(this), 1);
}
