function Game() {
	this.pawns = [];
	this.lastTick = new Date();

	this.canvas = document.createElement('canvas');

	var resizeListener = this.resizeCanvas.bind(this);

	window.addEventListener("resize", resizeListener);

	document.body.appendChild(this.canvas);

	this.resizeCanvas();
}

Game.prototype.destructor = function() {
	window.removeEventListener("resize", this.resizeListener);
	this.canvas.parentNode.removeChild(this.canvas);	
}

Game.prototype.tick = function() {
	var now = new Date();
	var dt = now - this.lastTick;

	this.lastTick = now;
}

Game.prototype.resizeCanvas = function() {
	console.log(this.canvas.offsetWidth);
	this.canvas.setAttribute("width", this.canvas.offsetWidth);
	this.canvas.setAttribute("height", this.canvas.offsetHeight);
}

Game.prototype.CONSTANT_OF_GRAVITY = 1;
