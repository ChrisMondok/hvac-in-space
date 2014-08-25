var Star = extend(Planet, function Star() {
	Planet.apply(this, arguments)
	this.ringAngles = [];

	for(var i = 0; i < 4; i++) {
		this.ringAngles.push(Math.random() * 2 * Math.PI);
	}

	this.sound = getSoundSource(sounds.getAwayFromTheDamnSun);

	this.sound.loop = true;

	this.soundFilter = audioCtx.createBiquadFilter();
	this.soundFilter.frequency.value = 10;

	this.soundGain = audioCtx.createGain();
	this.soundGain.gain.value = 0;

	this.sound.connect(this.soundFilter);
	this.soundFilter.connect(this.soundGain);
	this.soundGain.connect(audioCtx.destination);

	this.sound.start(0);
});

Star.prototype.mass = 10000000;

Star.prototype.radius = 5000;

Star.prototype.draw = function(dt) {
	var ctx = this.game.ctx;

	ctx.fillStyle = 'white';
	ctx.beginPath();
	ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
	ctx.fill();

	ctx.strokeStyle = "rgba(255, 255, 255, 0.16)";
	ctx.lineWidth = 400;
	for(var i = 0; i < this.ringAngles.length; i++){

		ctx.beginPath();
		this.ringAngles[i] += dt * (2 * (i%2) - 1) / 50;
		var offset = PolarToRectangular(this.ringAngles[i], 1000);
		ctx.arc(this.x + offset.x, this.y + offset.y, this.radius * 1.00005, 0, 2 * Math.PI, false);
		ctx.stroke();
	}
}

Star.prototype.tick = function(dt) {
	Planet.prototype.tick.apply(this, arguments);

	var distances = this.game.instances[Ship.name].map(function(ship) {
		return this.distanceTo(ship) - this.radius;
	}, this);

	var minDistance = 0;
	if(distances.length)
		var minDistance = Math.min.apply(Math, distances);

	var delta = 23000;

	var mul = 1/(minDistance * 0.25 + 1);

	var frequency = 10 + delta * mul;

	this.soundFilter.frequency.value = frequency;

	this.soundGain.gain.value = minDistance < 2000 ? 1 : 0;
}

Star.prototype.destructor = function() {
	this.sound.stop();

	Planet.prototype.destructor.apply(this, arguments);
}
