function Particle(game, drawFunction, position, velocity, duration) {
	
	if(!game || !game instanceof Game)
		throw new TypeError("Game isn't right.");

	if(!drawFunction || !drawFunction instanceof Function)
		throw new TypeError("drawFunction isn't a function.");

	this.game = game;
	this.drawFunction = drawFunction;
	this.position = position || {x:0, y:0};
	this.velocity = velocity || {x:0, y:0};
	this.duration = duration || NaN;
	this.initialDuration = this.duration;

	game.addParticle(this);
}

Particle.prototype.tick = function(dt) {

	this.duration -= dt;
	if(this.duration < 0)
		return this.destructor();

	this.position.x += this.velocity.x;
	this.position.y += this.velocity.y;

}

Particle.prototype.draw = function(dt) {
	
	this.drawFunction.call(this, dt);

}

Particle.prototype.destructor = function() {
	return this.game.particles.splice(this.game.particles.indexOf(this), 1);
}
