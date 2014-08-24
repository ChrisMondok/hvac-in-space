function TwoBodyTest() {
	var a = new Planet(game, 200, 200);
	var b = new Planet(game, 1200, 200);

//	a.angularVelocity = 1;
//	b.angularVelocity = -1.5;
	a.body.SetAngularVelocity(1);
	b.body.SetAngularVelocity(-1.5);
	ship = new Ship(game, 100,100);
	window.ship = ship;

	ship.attachTo(a);
}

function SunTest() {
	var sun = new Star(game, 2000, 500);

	var earth = new Planet(game, 100, 500);
	earth.orbitBody(sun);
	//earth.body.SetLinearVelocity(new b2Vec2(0, 1387));

	window.sun = sun;
	window.earth = earth;
}

function ShipTest() {
	var sun = new Star(game, 1100, 500);

	var earth = new Planet(game, 100, 500);
	earth.orbitBody(sun);

	window.earth = earth;

	earth.body.SetAngularVelocity(0.13);

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
	var sun = new Star(game,900,500);

	for(var i=0; i<numPlanets; i++){
		var pos = PolarToRectangular(Math.random() * Math.PI / 2, (i+1) * 150);
		var planet = new Planet(game, pos.x + sun.x, pos.y + sun.y);
		console.log(sun.distanceTo(planet));
		planet.orbitBody(sun);
	}
}

function JointTest() {
	var firstPlanet = new Planet(game, 200, 200);
	var lastPlanet = firstPlanet;

	for(var i = 0; i < 100; i++) {
		var planet = new Planet(game, 400 + 200 * i, 200);
		if(lastPlanet) {
			var jointDef = new Box2D.Dynamics.Joints.b2RopeJointDef;

			jointDef.bodyA = planet.body;
			jointDef.bodyB = lastPlanet.body;

			jointDef.length = jointDef.maxLength = 200;

			jointDef.collideConnected = true;

			game.world.CreateJoint(jointDef);
		}
		lastPlanet = planet;
	}

	firstPlanet.body.ApplyImpulse(new b2Vec2(0, 100000000), firstPlanet.body.GetPosition());

	return;
	var a = window.a = new Planet(game, 200, 200);
	var b = window.b = new Planet(game, 500, 200);

	var jointDef = new Box2D.Dynamics.Joints.b2RopeJointDef;

	jointDef.length = 500;
	jointDef.bodyA = a.body;
	jointDef.bodyB = b.body;

	jointDef.length = jointDef.maxLength = 500;

	jointDef.collideConnected = true;

	window.jointDef = jointDef;

	window.joint = game.world.CreateJoint(jointDef);

}
