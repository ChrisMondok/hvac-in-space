var RopeSegment = extend(Pawn, function RopeSegment(){Pawn.apply(this, arguments)});

RopeSegment.prototype.draw = function(dt) {
	Pawn.prototype.draw.call(this, dt);
	var ctx = this.game.ctx;
	ctx.beginPath();
	ctx.fillStyle = "white";
	ctx.arc(this.x, this.y, 5, 0, 2*Math.PI);
	ctx.fill();
}

RopeSegment.prototype.tick = function(dt) {
	Pawn.prototype.tick.apply(this,arguments);
	this.collide(this.checkForCollisions());
}

RopeSegment.prototype.checkForCollisions = function () {

	var planets = this.game.getPlanets();
	for(var i=0; i<planets.length; i++){
		if (this.distanceTo(planets[i]) < planets[i].radius - 1)
			return planets[i];
	};
}

RopeSegment.prototype.collide = function(planet) {
	if (planet == null) return;
	this.attachTo(planet);
}
MixInto(RopeSegment.prototype, Attachable);
