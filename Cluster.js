var Cluster = extend(Pawn, function Cluster() {
	Pawn.apply(this, arguments)
	this.attachments = [];
	this.planets = [];
	this.drawRadius = 0;
});

Cluster.prototype.angle = 0;

Object.defineProperty(Cluster.prototype, "mass", {
	get: function() {
		return this.attachments
			.map(function(a) {return a.planet.mass})
			.reduce(function(a, b) {return a + b}, 0);
	}
});

Cluster.prototype.addPlanet = function(planet) {
	planet.cluster = this;

	var allPlanetsWeCareAbout = this.attachments.map(function(a) {return a.planet;});

	allPlanetsWeCareAbout.push(planet);

	var positions = allPlanetsWeCareAbout.map(function(p) {
		return {x: p.x, y: p.y};
	});

	var totalMass = allPlanetsWeCareAbout
		.map(function(p) {return p.mass})
		.reduce(function(a, b){return a + b;});

	this.velocity.x *= (totalMass - planet.mass);
	this.velocity.y *= (totalMass - planet.mass);
	this.velocity.x += planet.velocity.x;
	this.velocity.y += planet.velocity.y;
	this.velocity.x /= totalMass;
	this.velocity.y /= totalMass;

	var energies = allPlanetsWeCareAbout.map(function(p) {
		return {x: p.velocity.x * p.mass, y: p.velocity.y * p.mass};
	});

	var centerOfMass = positions.reduce(function(a, b) {
		return {x: a.x + b.x, y: a.y + b.y};
	});

	centerOfMass.x /= allPlanetsWeCareAbout.length;
	centerOfMass.y /= allPlanetsWeCareAbout.length;

	this.x = centerOfMass.x;
	this.y = centerOfMass.y;

	this.velocity.x += planet.velocity.x / allPlanetsWeCareAbout.length;
	this.velocity.y += planet.velocity.y / allPlanetsWeCareAbout.length;

	planet.velocity = {x:0, y: 0};

	this.attachments = allPlanetsWeCareAbout.map(function(p) {
		return {
			planet: p,
			distance: this.distanceTo(p),
			angle: p.angle - this.angle,
			direction: this.directionTo(p) - this.angle
		};
	}, this);
};

Cluster.prototype.draw = function(dt) {
	var ctx = this.game.ctx;

	ctx.strokeStyle = "red";

	ctx.beginPath();
	ctx.moveTo(this.x, this.y);

	this.attachments.forEach(function(a) {
		ctx.lineTo(a.planet.x, a.planet.y)
		ctx.lineTo(this.x, this.y);
	}, this);

	ctx.stroke();
}

Cluster.prototype.destructor = function() {
	this.attachments.forEach(function(a) {
		a.planet.cluster = null;
	}, this);
	Pawn.prototype.destructor.apply(this, arguments);
}

Cluster.prototype.tick = function(dt) {
	Pawn.prototype.tick.apply(this, arguments);

	this.attachments.forEach(function(attachment) {
		var offset = PolarToRectangular(this.angle + attachment.direction, attachment.distance);
		attachment.planet.x = this.x + offset.x;
		attachment.planet.y = this.y + offset.y;
		attachment.planet.angle = this.angle + attachment.angle;
		attachment.planet.velocity = {x: this.velocity.x, y: this.velocity.y};
		attachment.planet.angularVelocity = this.angularVelocity;
	}, this);
};
