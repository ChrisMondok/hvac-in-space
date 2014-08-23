function Attachable() {
	this.anchor = null;
	this.anchorAngle = undefined;
}

Attachable.prototype.tick = function(dt) {
	if(this.anchor) {
		this.angle = this.anchorAngle + this.anchor.angle;
		this.x = this.anchor.x + (Math.cos(this.angle) * this.anchor.radius || 0);
		this.y = this.anchor.y + (Math.sin(this.angle) * this.anchor.radius || 0);
	}
}

Attachable.prototype.attachTo = function(anchor) {
	this.anchor = anchor;
	this.anchorAngle = anchor.directionTo(this);
	this.velocity = {x:0, y:0};
}
