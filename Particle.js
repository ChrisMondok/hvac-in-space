function Particle(game, drawFunction, position, velocity, duration, properties) {
	
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
	this.properties = properties;

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

Particle.linearFade = function(dt) {


	this.game.ctx.save();
	this.game.ctx.globalAlpha = (this.duration / this.initialDuration);
	//this.game.ctx.drawImage(images.sun, this.position.x, this.position.y, 20, 20);
	this.game.ctx.fillStyle = this.properties.color;
	this.game.ctx.beginPath();
	this.game.ctx.arc(this.position.x, this.position.y, this.properties.radius, 0, Math.PI * 2);
	this.game.ctx.fill();
	this.game.ctx.restore();
}
