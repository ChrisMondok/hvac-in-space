function Game() {
	this.pawns = [];
	this.lastTick = new Date();

	this.canvas = document.createElement('canvas');

	this.ctx = this.canvas.getContext('2d');

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

	this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

	for(var i = 0; i < this.pawns.length; i++) {
		this.pawns[i].tick(dt);
	}

	var planets = this.pawns.filter(function(pawn) { return pawn instanceof Planet; });
	for(var i = 0; i < planets.length - 1; i++) {
		for(var j = i + 1; j < planets.length; j++) {
			var gravity = planets[i].getGravity(planets[j]);
			planets[i].addForce(gravity);
			planets[j].addForce({x: -gravity.x, y: -gravity.y});
		}
	}

	for(var i = 0; i < this.pawns.length; i++) {
		this.pawns[i].draw(dt);
	}

	this.lastTick = now;
}

Game.prototype.resizeCanvas = function() {
	console.log(this.canvas.offsetWidth);
	this.canvas.setAttribute("width", this.canvas.offsetWidth);
	this.canvas.setAttribute("height", this.canvas.offsetHeight);
}

Game.prototype.CONSTANT_OF_GRAVITY = 1;
