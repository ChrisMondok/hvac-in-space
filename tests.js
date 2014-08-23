function TwoBodyTest() {
	var a = new Planet(game, 200, 200);
	var b = new Planet(game, 600, 200);

	a.velocity.y = 1;
	b.velocity.y = -1;
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

	ship = new Ship(game);
	ship.planet = earth;
}
