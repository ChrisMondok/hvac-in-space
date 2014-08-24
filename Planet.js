var Planet = extend(Pawn, function Planet(game, x, y) {
	Pawn.apply(this, arguments);
});

Planet.prototype.image = images.bluePlanet;

Planet.prototype.radius = 1;

Planet.prototype.getGravity = function(otherPlanet) {
//	if(!(this.mass && otherPlanet.mass))
//		throw new RangeError('Both bodies must have mass!');

	var massProduct = this.body.GetMass() * otherPlanet.body.GetMass();
	var magnitude = this.game.CONSTANT_OF_GRAVITY * (massProduct) / Math.pow(this.distanceTo(otherPlanet),2);
	var direction = this.directionTo(otherPlanet);

	return PolarToRectangular(direction, magnitude);
}

Planet.prototype.createBody = function(x, y) {
	var fixDef = new b2FixtureDef();
	fixDef.density = 0.01;
	fixDef.friction = 0.5;
	fixDef.restitution = 0.2;

	fixDef.shape = new b2CircleShape(3);

	var bodyDef = new b2BodyDef();
	bodyDef.type = b2Body.b2_dynamicBody;
	bodyDef.position.x = x;
	bodyDef.position.y = y;
	
	this.body = this.game.world.CreateBody(bodyDef);
	this.fixture = this.body.CreateFixture(fixDef);
}

Planet.prototype.draw = function(dt) {
	Pawn.prototype.draw.call(this, dt);

	var ctx = this.game.ctx;

	var position = this.getPosition();
	var angle = this.getAngle();

	ctx.drawSprite(this.image, position.x, position.y, angle);
}

Planet.prototype.orbitBody = function(otherBody, clockwise) {
	var totalMass = this.body.GetMass() + otherBody.body.GetMass();

	var magnitude = Math.sqrt( game.CONSTANT_OF_GRAVITY * (totalMass) / this.distanceTo(otherBody));


	var direction = this.directionTo(otherBody);

	if(clockwise)
		direction += Math.PI/2;
	else
		direction -= Math.PI/2;

	var velocity = PolarToRectangular(direction, magnitude);

	this.body.SetLinearVelocity(new b2Vec2(velocity.x, velocity.y));

	window.body = this.body;

	return;

	this.velocity.x = otherBody.velocity.x;
	this.velocity.y = otherBody.velocity.y;

	var forceDirection = this.directionTo(otherBody);

	this.addForce(force);
	otherBody.addForce({x:force.x * -1, y:force.y * -1});
}

var Star = extend(Planet, function Sun(game, x, y) {
	Planet.apply(this, arguments);
});

Star.prototype.draw = function(dt) {
	var ctx = this.game.ctx;
	ctx.fillStyle = "white";
	ctx.beginPath();
	var pos = this.getPosition();
	ctx.arc(pos.x, -pos.y, this.radius, 0, 2*Math.PI, false);
	ctx.fill();
}

Star.prototype.createBody = function(x, y) {
	var fixDef = new b2FixtureDef();
	fixDef.density = 1000.0;
	fixDef.friction = 0.5;
	fixDef.restitution = 0.2;

	fixDef.shape = new b2CircleShape(this.radius);

	var bodyDef = new b2BodyDef();
	bodyDef.type = b2Body.b2_dynamicBody;
	bodyDef.position.x = x;
	bodyDef.position.y = y;
	
	this.body = this.game.world.CreateBody(bodyDef);
	this.fixture = this.body.CreateFixture(fixDef);
}

Star.prototype.radius = 1024;
Star.prototype.image = images.sun;
