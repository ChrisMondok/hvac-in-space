var Ship = extend(Pawn, function Ship() {
	Pawn.apply(this, arguments)
	this.nodes = [];
});

Ship.prototype.NODE_DISTANCE = 64;

Ship.prototype.planet = undefined;

Ship.prototype.planetAngle = 0;
Ship.prototype.angle = 0;
Ship.prototype.mass = 1;

Ship.prototype.distanceTraveled = 0;
Ship.prototype.distanceSinceLastNode = 0;

Ship.prototype.image = images.ship;

Ship.prototype.tick = function(dt) {
	Pawn.prototype.tick.call(this,dt);

	this.collide(this.checkForCollisions());

	if(this.nodes.length){
		if(this.weAreTooFarFromThePreviousNode())
			this.nodes.push(new RopeSegment(game, this.x, this.y));
	}
	this.adjustRope(dt);
	if(!this.anchor)
		this.beAffectedByGravity(dt);

}

Ship.prototype.adjustRope = function() {
	for(var i = 1; i < this.nodes.length; i++)
	{
		var thisNode = this.nodes[i];
		var previousNode = this.nodes[i-1];

		if(thisNode.distanceTo(previousNode) > this.NODE_DISTANCE) {
			var direction = previousNode.directionTo(thisNode);
			var offset = PolarToRectangular(direction, this.NODE_DISTANCE);

			thisNode.x = previousNode.x + offset.x;
			thisNode.y = previousNode.y + offset.y;
		}
	}
}

Ship.prototype.weAreTooFarFromThePreviousNode = function() {
	var lastNode = this.nodes[this.nodes.length - 1];
	return this.distanceTo(lastNode) > this.NODE_DISTANCE;
}

Ship.prototype.destructor = function() {
	Pawn.prototype.destructor.apply(this, arguments);
	this.nodes.forEach(function(n) {
		n.destructor();
	});
}

Ship.prototype.beAffectedByGravity = function(dt) {
	var planets = game.instances[Planet.name];
	var force = {x: 0, y: 0};
	
	for(var i = 0; i < planets.length; i++) {
		var magnitude = dt * (game.CONSTANT_OF_GRAVITY * planets[i].mass)/Math.pow(planets[i].distanceTo(this), 2);
		var direction = this.directionTo(planets[i]);
		
		var rect = PolarToRectangular(direction, magnitude);
		force.x += rect.x;
		force.y += rect.y;
	}

	//this works because we're treating mass as 1. I think.
	this.velocity.x += force.x;
	this.velocity.y += force.y;
};

Ship.prototype.draw = function(dt) {
	Pawn.prototype.draw.call(this, dt);

	this.game.ctx.drawImageRotated(this.image, this.x, this.y, this.angle);

	if(this.nodes.length)
		this.drawRope(dt);
}

Ship.prototype.drawRope = function(dt) {
	var ctx = this.game.ctx;
	ctx.strokeStyle = "#FFFFFF";
	ctx.lineWidth = 8;
	ctx.beginPath();
	this.nodes.forEach(function(n) { ctx.lineTo(n.x, n.y); });
	ctx.lineTo(this.x, this.y);
	ctx.stroke();
}

Ship.prototype.fire = function(targetVelocity) {
	var node = new RopeSegment(game, this.x, this.y);
	node.attachTo(this.anchor);

	this.nodes.push(node);

	this.detatch();

	this.distanceTraveled = 0;

	var force = PolarToRectangular(this.angle, targetVelocity);

	this.addForce(force);
}

Ship.prototype.checkForCollisions = function () {

	var planets = this.game.getPlanets();
	for(var i=0; i<planets.length; i++){
		if (this.distanceTo(planets[i]) < planets[i].radius - 1)
			return planets[i];
	};
}

Ship.prototype.collide = function(planet) {
	if (planet == null) return;
	this.attachTo(planet);
}

MixInto(Ship.prototype, Attachable);
