function Game() {
	this.instances = {};
	for(var key in types)
		this.instances[key] = [];

	this.lastTick = new Date();

	this.canvas = document.createElement('canvas');

	this.ctx = this.canvas.getContext('2d');

	var resizeListener = this.resizeCanvas.bind(this);

	window.addEventListener('resize', resizeListener);

	document.body.appendChild(this.canvas);

	this.resizeCanvas();

	this.backgroundPattern = this.ctx.createPattern(this.backgroundImage, 'repeat');
	this.starPattern = this.ctx.createPattern(images.stars, 'repeat');
}

Game.prototype.timeScale = 1;

Game.prototype.backgroundImage = images.background;

Game.prototype.destructor = function() {
	window.removeEventListener('resize', this.resizeListener);
	this.canvas.parentNode.removeChild(this.canvas);
}

Game.prototype.addPawn = function(pawn) {
	for(var typeName in this.instances) {
		if(pawn instanceof types[typeName])
			this.instances[typeName].push(pawn);
	}
}

Game.prototype.tick = function() {
	var now = new Date();
	var dt = (now - this.lastTick)/1000 * this.timeScale;

	var pawns = this.instances[Pawn.name];
	this.instances[Pawn.name].forEach(function(p) {
		p.tick(dt);
	});

	var planets = this.instances[Planet.name];

	for(var i = 0; i < planets.length - 1; i++) {
		for(var j = i + 1; j < planets.length; j++) {
			var gravity = planets[i].getGravity(dt, planets[j]);
			planets[i].addForce(gravity);
			planets[j].addForce({x: -gravity.x, y: -gravity.y});
		}
	}

	this.draw(dt);

	this.lastTick = now;
}

Game.prototype.draw = function(dt) {
	this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
	this.ctx.fillStyle = 'black';
	this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
	this.ctx.fillStyle = this.backgroundPattern;
	this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
	this.ctx.fillStyle = this.starPattern;
	this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

	this.instances[Pawn.name].forEach(function(pawn) {
		pawn.draw(dt);
	});

	this.ctx.textAlign = 'right';
	this.ctx.fillStyle = '#FFF';
	this.ctx.fillText(Math.floor(this.timeScale/dt), this.canvas.width - 32, 32);
}

Game.prototype.resizeCanvas = function() {
	console.log(this.canvas.offsetWidth);
	this.canvas.setAttribute('width', this.canvas.offsetWidth);
	this.canvas.setAttribute('height', this.canvas.offsetHeight);
}

Game.prototype.CONSTANT_OF_GRAVITY = 1;
