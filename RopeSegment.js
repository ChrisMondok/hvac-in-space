var RopeSegment = extend(Pawn, function RopeSegment(){Pawn.apply(this, arguments)});

RopeSegment.prototype.draw = function(dt) {
	Pawn.prototype.draw.call(this, dt);
	return;
	var ctx = this.game.ctx;
	ctx.beginPath();
	ctx.fillStyle = "white";
	ctx.arc(this.x, this.y, 10, 0, 2*Math.PI);
	ctx.fill();
}

RopeSegment.prototype.tick = function(dt) {
	Pawn.prototype.tick.apply(this,arguments);
	this.collide(this.checkForCollisions());
}

RopeSegment.prototype.interpolateTo = function(target, amount) {
	if(!this.interpolateStartedAt)
		this.interpolateStartedAt = { x: this.x, y: this.y };

	if(this.anchor)
		return;

	var output= InterpolatePositions(this.interpolateStartedAt, target, amount);

	this.x = output.x;
	this.y = output.y;
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

RopeSegment.prototype.destructor = function() {
	Pawn.prototype.destructor.call(this);
	console.log('boom');
	for(var i=0; i<8; i++){
		new Particle(
				game,
				Particle.linearFade,
				{
					x:this.x,
					y:this.y
				},
				PolarToRectangular(Math.random() * Math.PI * 2, 5 * Math.random()),
				.4,
				{
					color:'#FFFFFF',
					radius:2
				}
		);
	}
}

MixInto(RopeSegment.prototype, Attachable);
