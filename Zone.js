var Zone = extend(Pawn, function Zone() {
	Pawn.apply(this, arguments);
	this.planets = [];

});

Zone.prototype.radius = 500;
Zone.prototype.radiusFactor = 10;

Zone.prototype.ship = undefined;
Zone.prototype.shipOutsideZone = 1000;

Zone.prototype.recenter = function() {
	var x = 0;
	var y = 0;
	var totalMass = 0;

	this.planets.forEach(function (planet) {
		x += planet.x * planet.mass;
		y += planet.y * planet.mass;
		totalMass += planet.mass;
	},this);

	this.x = x/totalMass;
	this.y = y/totalMass;
	//return {x:x/totalMass, y:y/totalMass};
	
	//this.radius = Math.sqrt(totalMass) * this.radiusFactor ;
}

Zone.prototype.containsPlanet = function(pawn) {
	return this.distanceTo(pawn) < this.radius;
}

Zone.prototype.draw = function(dt) {

	Pawn.prototype.draw.call(this,dt);

	var color = '#4444EE';

	this.game.ctx.beginPath()
	this.game.ctx.fillStyle = color;
	this.game.ctx.arc(this.x, this.y, 10, 0, Math.PI * 2);
	this.game.ctx.fill();

	this.game.ctx.beginPath();
	this.game.ctx.strokeStyle = color;
	this.game.ctx.lineWidth = 20;
	this.game.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
	this.game.ctx.stroke();
	this.game.ctx.closePath();

	this.game.ctx.beginPath();
	this.game.ctx.save();
	this.game.ctx.fillStyle = color;
	this.game.ctx.globalAlpha = .15;
	this.game.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
	this.game.ctx.fill();
	this.game.ctx.restore();

}

Zone.prototype.allInACLuster = function() {

	var firstCluster;
	for(var i=0; i<this.planets.length; i++) {
		if(firstCluster == undefined)
			firstCluster = this.planets[i].cluster;
		else
			if(this.planets[i].cluster == firstCluster)
				continue;
			else
				return false;

		if(firstCluster == undefined)
			return false;
	}
	return true;
}

Zone.prototype.tick = function(dt) {
	
	Pawn.prototype.tick.call(this,dt);

	this.recenter();

	if((this.shipOutsideZone + this.radius) < this.distanceTo(this.ship))
		this.game.lose();
	

	var escapedPlanets = [];
	this.planets.forEach( function(planet) {
		if(!this.containsPlanet(planet)){
			console.log("We lost a planet! Oh noes!");
			escapedPlanets.push(planet);
		}
	}, this);
	
	escapedPlanets.forEach(function(planet) {
		this.planets.splice(this.planets.indexOf(planet), 1);
	},this);

	if (this.allInACLuster()){
		this.game.win()
	}
}
