function Game() {
	this.instances = {};
	for(var key in types)
		this.instances[key] = [];

	this.particles = [];

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

	this.startMusic();

	this.keyListener = this.keyHandler.bind(this);
	document.addEventListener('keypress', this.keyListener);
}

Game.prototype.keyHandler = function(keyEvent) {
	var code = keyEvent.which || keyEvent.keyCode;

	if(code == 43 || code == 61) //plus, equals
		this.screenScale = Math.min(this.screenScale + 0.1, 1);
	if(code == 45) //minus
		this.screenScale = Math.max(this.screenScale - 0.1, 0.1)

	keyEvent.preventDefault();
}

Game.prototype.startMusic = function() {
	this.guitars = getSoundSource(sounds.guitar);
	this.guitars.loop = true;

	this.guitarLowPassFilter = audioCtx.createBiquadFilter();
	this.guitarLowPassFilter.type = 0;
	this.guitarLowPassFilter.frequency.value = 24000;

	this.guitars.connect(this.guitarLowPassFilter);
	this.guitarLowPassFilter.connect(audioCtx.destination);

	this.notWinchingDrums = getSoundSource(sounds.smallDrums);
	this.notWinchingDrums.loop = true;
	
	this.notWinchingGainNode = audioCtx.createGain();
	this.notWinchingDrums.connect(this.notWinchingGainNode);
	this.notWinchingGainNode.connect(audioCtx.destination);

	this.winchingDrums = getSoundSource(sounds.drumsAndBass);
	this.winchingDrums.loop = true;
	
	this.winchingGainNode = audioCtx.createGain();
	this.winchingDrums.connect(this.winchingGainNode);
	this.winchingGainNode.connect(audioCtx.destination);

	this.winchingGainNode.gain.value = 0;

	this.guitars.start(0);
	this.notWinchingDrums.start(0);
	this.winchingDrums.start(0);
}

Game.prototype.timeScale = 1;

Game.prototype.backgroundImage = images.background;

Game.prototype.destructor = function() {
	window.removeEventListener('resize', this.resizeListener);
	this.canvas.parentNode.removeChild(this.canvas);

	document.addEventListener('keypress', this.keyListener);

	this.instances[Pawn.name].slice(0).forEach(function(pawn) {
		pawn.destructor();
	}, this);
	this.guitars.stop();
	this.notWinchingDrums.stop();
	this.winchingDrums.stop();
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

Game.prototype.addParticle = function(particle) {
	this.particles.push(particle);
}

Game.prototype.tick = function() {
	var now = new Date();
	var dt = (now - this.lastTick)/1000 * this.timeScale;

	this.particles.forEach(function(particle) {
		particle.tick(dt);
	});

	var pawns = this.instances[Pawn.name];
	this.instances[Pawn.name].forEach(function(p) {
		p.tick(dt);
	});

	this.tickPlanets(dt);

	this.filterSounds(dt);

	this.draw(dt);

	if(this.aShipIsWinching()) {
		this.winchingGainNode.gain.value = 1;
		this.notWinchingGainNode.gain.value = 0;
	}
	else {
		this.winchingGainNode.gain.value = 0;
		this.notWinchingGainNode.gain.value = 1;
	}

	this.lastTick = now;
};

Game.prototype.aShipIsWinching = function() {
	return this.instances[Ship.name].some(function(ship) {
		return Boolean(ship.otherPlanet);
	});
};

Game.prototype.filterSounds = function() {
	var planets = this.instances[Planet.name];

	var distances = this.instances[Ship.name].map(function(ship) {
		return ship.distanceToClosestPlanet();
	});

	var minDistance = 0;
	if(distances.length)
		var minDistance = Math.min.apply(Math, distances);

	var delta = 23000;

	var mul = 1/(minDistance * 0.025 + 1);

	var frequency = 10 + delta * mul;

	this.guitarLowPassFilter.frequency.value = frequency;

};

(function() {
	var planetsCollide = function(a, b) {
		return a.distanceTo(b) < a.radius + b.radius
	}

	var planetsShouldInteract = function(a, b) {
		if(a.cluster && b.cluster) {
			return a.cluster != b.cluster;
		}
		else
			return true;
	}

	Game.prototype.tickPlanets = function(dt) {
		var planets = this.instances[Planet.name];

		for(var i = 0; i < planets.length - 1; i++) {
			for(var j = i + 1; j < planets.length; j++) {
				if(planetsShouldInteract(planets[i], planets[j])) {
					if(planetsCollide(planets[i], planets[j])) {
						if(this.aShipIsTetheringThesePlanets(planets[i], planets[j]))
							this.mergePlanets(planets[i], planets[j])
						else
							console.log("Interplanetary collisions!");
					}
					else {
						var gravity = planets[i].getGravity(dt, planets[j]);
						planets[i].addForce(gravity);
						planets[j].addForce({x: -gravity.x, y: -gravity.y});
					}
				}
			}
		}
	}
})();

Game.prototype.aShipIsTetheringThesePlanets = function(a, b) {
	return this.instances.Ship.some(function(ship) {
		return (ship.anchor == a && ship.otherPlanet == b) || (ship.anchor == b && ship.otherPlanet == a);
	});
}

Game.prototype.aShipIsConnectedToThisPlanetSomehow = function(planet) {
	return this.instances.Ship.some(function(ship) {
		if(ship.anchor == planet || ship.otherPlanet == planet)
			return true;

		if(planet.cluster) {
			if(ship.anchor.cluster == planet.cluster)
				return true;
			if(ship.otherPlanet.cluster == planet.cluster)
				return true;
		}

	});
}


Game.prototype.mergePlanets = function(a, b) {
	playSound(sounds.planetsConnected);
	if(!a.cluster && !b.cluster) {
		var cluster = new Cluster(this);
		cluster.addPlanet(a);
		cluster.addPlanet(b);
	}
	else {
		if(Boolean(a.cluster) != Boolean(b.cluster)) {
			var cluster = a.cluster || b.cluster;
			var planetNotInCluster = a.cluster ? b : a;
			cluster.addPlanet(planetNotInCluster);
		} else {
			var planetsToAddToClusterA = b.cluster.attachments.map(function(a) {
				return a.planet;
			});

			b.cluster.destructor();
			planetsToAddToClusterA.forEach(function(p) {
				a.cluster.addPlanet(p);
			});
		}
	}
}

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

	this.ctx.scale(this.screenScale, this.screenScale);

	this.particles.forEach(function(particle) {
		particle.draw(dt);
	});

	this.instances[Cluster.name].forEach(function(cluster) {
		cluster.drawConnections(dt);
	});

	this.instances[Pawn.name].forEach(function(pawn) {
		pawn.draw(dt);
	});

	this.ctx.restore();

	this.ctx.textAlign = 'right';
	this.ctx.fillStyle = '#FFF';
	this.ctx.fillText(Math.floor(this.timeScale/dt), this.canvas.width - 32, 32);
};

Game.prototype.centerShips = function(dt) {
	var ships = this.instances[Ship.name];

	if(ships.length) {
		var center = {x: 0, y: 0};
		for(var i = 0; i < ships.length; i++) {
			var ship = ships[i];

			if(ship.anchor)
				direction = ship.angle;
			else
				direction = RectangularToPolar(ship.velocity.x, ship.velocity.y);

			var offset = PolarToRectangular(direction, ship.focalDistance);
			var focalPoint = {x: ship.x + offset.x, y: ship.y + offset.y};
			center.x += focalPoint.x;
			center.y += focalPoint.y;
		}

		center.x /= ships.length;
		center.y /= ships.length;

		this.screenTopLeft = {
			x: -center.x * this.screenScale + this.canvas.width/2,
			y: -center.y * this.screenScale + this.canvas.height/2
		};

	}

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

Game.prototype.CONSTANT_OF_GRAVITY = 10;
