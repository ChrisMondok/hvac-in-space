var level1 = function(){
   	var game = new Game(); 
	this.zone = new Zone(game,0,0);
	zone.planets.push(new Planet(game, 0,0));
	zone.planets.push(new Planet(game, 600, 0));
	zone.planets.push(new Planet(game, 300, 450));
	new Ship(game,0,0).attachTo(zone.planets[0]);
	game.victory = false;
	game.win = function() {
		if(!this.victory){
			alert('Hoo boy you won!');
			this.victory = true;
		}
	};
	return game;

}

var level2 = function(){
   	var game = new Game(); 
	this.zone = new Zone(game,0,0);
	zone.planets.push(new Planet(game, 0,0));
	zone.planets.push(new Planet(game, 600, 0));
	zone.planets.push(new Planet(game, 300, 450));
	new Ship(game,0,0).attachTo(zone.planets[0]);
	game.victory = false;
	game.win = function() {
		if(!this.victory){
			alert('Hoo boy you won!');
			this.victory = true;
		}
	};
	return game;

}

var level3 = function(){
   	var game = new Game(); 
	this.zone = new Zone(game,0,0);
	zone.planets.push(new Planet(game, 0,0));
	zone.planets.push(new Planet(game, 600, 0));
	zone.planets.push(new Planet(game, 300, 450));
	new Ship(game,0,0).attachTo(zone.planets[0]);
	game.victory = false;
	game.win = function() {
		if(!this.victory){
			alert('Hoo boy you won!');
			this.victory = true;
		}
	};
	return game;

}

