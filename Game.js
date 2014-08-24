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

	this.screenScale = 1;
	this.screenTopLeft = {x: 0, y: 0};

	this.world = new b2World(new b2Vec2(0, 0),true);

	var debugDraw = new b2DebugDraw();
		debugDraw.SetSprite(this.ctx);
		debugDraw.SetDrawScale(30.0);
		debugDraw.SetFillAlpha(0.3);
		debugDraw.SetLineThickness(1.0);
		debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
	this.world.SetDebugDraw(debugDraw);

	this.debugDraw = debugDraw;
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

Game.prototype.removePawn = function(pawn) {
	for(var typeName in this.instances) {
		if(pawn instanceof types[typeName])
			this.instances[typeName].splice(this.instances[typeName].indexOf(pawn), 1);
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
			var gravity = planets[i].getGravity(planets[j]);
			planets[i].body.ApplyForce(new b2Vec2(gravity.x, gravity.y), planets[i].getPosition());
			planets[j].body.ApplyForce(new b2Vec2(-gravity.x, -gravity.y), planets[j].getPosition());
		}
	}

	this.world.Step(dt, 8, 3);
	this.world.ClearForces();

	this.draw(dt);

	this.lastTick = now;
};

Game.prototype.draw = function(dt) {
	this.ctx.save();

	this.centerShips(dt);

	this.ctx.clearRect(-this.screenTopLeft.x, -this.screenTopLeft.y, this.canvas.width, this.canvas.height);
	this.ctx.fillStyle = 'black';
	this.ctx.fillRect(-this.screenTopLeft.x, -this.screenTopLeft.y, this.canvas.width, this.canvas.height);
	this.ctx.fillStyle = this.backgroundPattern;
	this.ctx.fillRect(-this.screenTopLeft.x, -this.screenTopLeft.y, this.canvas.width, this.canvas.height);
	this.ctx.fillStyle = this.starPattern;
	this.ctx.fillRect(-this.screenTopLeft.x, -this.screenTopLeft.y, this.canvas.width, this.canvas.height);

	this.instances[Pawn.name].forEach(function(pawn) {
		pawn.draw(dt);
	});
	this.ctx.restore();

	this.ctx.textAlign = 'right';
	this.ctx.fillStyle = '#FFF';
	this.ctx.fillText(Math.floor(this.timeScale/dt), this.canvas.width - 32, 32);

	this.world.DrawDebugData(this.debugDraw);
};

Game.prototype.centerShips = function(dt) {
	var center = {x: 0, y: 0};
	var ships = this.instances[Ship.name];

	if(ships.length) {
		for(var i = 0; i < ships.length; i++) {
			var ship = ships[i];

			var shipPosition = ship.getPosition();
			var shipVelocity = ship.body.GetLinearVelocity();
			if(ship.anchor)
				direction = ship.getAngle();
			else
				direction = RectangularToPolar(shipVelocity.x, shipVelocity.y);

			var offset = PolarToRectangular(direction, ship.focalDistance);
			var focalPoint = {x: shipPosition.x + offset.x, y: shipPosition.y + offset.y};
			center.x += focalPoint.x;
			center.y += focalPoint.y;
		}

		center.x /= ships.length;
		center.y /= ships.length;
	}
	else {
		center.x = this.canvas.width/2;
		center.y = this.canvas.height/2;
	}

	this.screenTopLeft = {
		x: -center.x + this.canvas.width/2,
		y: center.y + this.canvas.height/2
	};

	this.ctx.translate(this.screenTopLeft.x, this.screenTopLeft.y);
};

Game.prototype.resizeCanvas = function() {
	console.log(this.canvas.offsetWidth);
	this.canvas.setAttribute('width', this.canvas.offsetWidth);
	this.canvas.setAttribute('height', this.canvas.offsetHeight);
}

Game.prototype.getPlanets = function() {
	return this.instances[Planet.name];
}

Game.prototype.CONSTANT_OF_GRAVITY = 1;
