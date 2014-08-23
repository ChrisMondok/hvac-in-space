function Attachable() {
	this.anchor = null;
	this.anchorAngle = undefined;
}

Attachable.prototype.tick = function(dt) {
	if(this.anchor) {
		this.angle = this.anchorAngle + this.anchor.angle;
		var offset = PolarToRectangular(this.anchorAngle + this.anchor.angle, this.anchor.radius || 0);
		this.x = this.anchor.x + offset.x;
		this.y = this.anchor.y + offset.y;
	}
}

Attachable.prototype.attachTo = function(anchor) {
	this.anchor = anchor;
	this.anchorAngle = anchor.directionTo(this) - anchor.angle;
	this.velocity = {x:0, y:0};
}

Attachable.prototype.detatch = function() {
	if(this.anchor == undefined)
		throw new Error('Not allowed to fire the ship while not attached to a planet!');

	this.velocity = { x: this.anchor.velocity.x, y: this.anchor.velocity.y }
	this.angularVelocity = this.anchor.angularVelocity;

	this.anchor = undefined;
}
