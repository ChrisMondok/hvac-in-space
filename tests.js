function TwoBodyTest() {
	var a = new Planet(game, 200, 200);
	var b = new Planet(game, 600, 200);

	a.angularVelocity = 1;
	ship = new Ship(game, 100,100);
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
