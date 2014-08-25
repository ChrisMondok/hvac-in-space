function TwoBodyTest() {
	var a = new Planet(game, 200, 200);
	var b = new Planet(game, 1200, 200);

	a.angularVelocity = 1;
	b.angularVelocity = -1.5;
	ship = new Ship(game, 100,100);
	window.a = a;
	window.b = b;
	window.ship = ship;

	ship.attachTo(a);
}

function SunTest() {
	var sun = new Planet(game, 1100, 500);
	sun.mass = 3000000;
	sun.image = images.sun;

	var earth = new Planet(game, 100, 500);
	earth.orbitBody(sun);
}

function ShipTest() {
	var sun = new Planet(game, 1100, 500);
	sun.mass = 3000000;
	sun.image = images.sun;

	var earth = new Planet(game, 100, 500);
	earth.orbitBody(sun);

	earth.angularVelocity = 0.13;

	ship = new Ship(game, 100, 600);
	window.ship = ship;

	ship.attachTo(earth);
}

function LassoTest() {
	var a = new Planet(game, 100, 200);
	var b = new Planet(game, 800, 200);

	var c = new Planet(game, 450, 600);

	c.image = images.redPlanet;

	ship = new Ship(game, 300,200);
	window.ship = ship;

	ship.attachTo(a);

	ship.fire(100);

	c.velocity = {x:0, y: -100};
}

function SolarSystemTest(numPlanets) {
	var sun = new Planet(game,900,500);
	sun.mass = 3000000;
	sun.image = images.sun;

	for(var i=0; i<numPlanets; i++){
		var pos = PolarToRectangular(Math.random() * Math.PI / 2, (i+1) * 150);
		var planet = new Planet(game, pos.x + sun.x, pos.y + sun.y);
		console.log(sun.distanceTo(planet));
		planet.orbitBody(sun);
	}
}

function ParticleGeneratorTest() {

	var ship = new Ship(game, 200, 200);
	ship.timeBetweenParticles = 1000;
	ship.tick = function(dt) {
		Ship.prototype.tick.call(this,dt);
	};

	ship.velocity = {x:50, y:0};
	return ship;
}


function AttachmentTest() {
	a = new Planet(game, 200, 200);
	b = new Planet(game, 400, 200);

	cluster = new Cluster(game, 300, 200);

	cluster.addPlanet(a);
	cluster.addPlanet(b);
}
