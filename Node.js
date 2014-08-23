var Node = extend(Pawn);

Node.prototype.draw = function(dt) {
	Pawn.prototype.draw.call(this, dt);
	var ctx = this.game.ctx;
	ctx.beginPath();
	ctx.fillStyle = "white";
	ctx.arc(this.x, this.y, 5, 0, 2*Math.PI);
	ctx.fill();
}
