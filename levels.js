var level1 = function(){
   	var game = new Game(); 
	this.zone = new Zone(game,0,0);
	zone.planets.push(new Planet(game, 0,0));
	zone.planets.push(new Planet(game, 600, 0));
	zone.planets.push(new Planet(game, 300, 450));
	zone.ship = new Ship(game,0,0);
	zone.ship.attachTo(zone.planets[0]);
	game.victory = false;
	game.win = function() {
		if(!this.victory){
			alert('Hoo boy you won!');
			this.victory = true;
			game.destructor();
			goToState('title');
			game.over = true;
		}
	};
	game.loss = false;
	game.lose = function() {
		if(!this.loss){
			alert('You succumbed to the cold vaccuum of space :(');
			this.loss = true;
			game.destructor();
			goToState('title');
			game.over = true;
		}
	}
	return game;

}

var level2 = function(){
   	var game = new Game(); 
	this.zone = new Zone(game,0,0);
	zone.planets.push(new Planet(game, 0,0));
	zone.planets.push(new Planet(game, 900, 0));
	zone.planets.push(new Planet(game, 600, 450));
	zone.planets.push(new Planet(game, 900, 750));
	zone.radius = 2000;
	zone.ship = new Ship(game,0,0);
	zone.ship.attachTo(zone.planets[0]);
	game.victory = false;
	game.win = function() {
		if(!this.victory){
			alert('Hoo boy you won!');
			this.victory = true;
			game.destructor();
			goToState('title');
			game.over = true;
		}
	};
	game.loss = false;
	game.lose = function() {
		if(!this.loss){
			alert('You succumbed to the cold vaccuum of space :(');
			this.loss = true;
			game.destructor();
			goToState('title');
			game.over = true;
		}
	}
	return game;

}

var level3 = function(){
   	var game = new Game(); 
	this.zone = new Zone(game,0,0);
	zone.planets.push(new Planet(game, 0,0));
	zone.planets.push(new Planet(game, 600, 0));
	zone.planets.push(new Planet(game, 300, 450));
	zone.planets.push(new Planet(game, 900,0));
	zone.planets.push(new Planet(game, 600, 750));
	zone.planets.push(new Planet(game, 1500, 750));
	zone.radius = 1600;
	zone.ship = new Ship(game,0,0);
	zone.ship.attachTo(zone.planets[0]);
	game.victory = false;
	game.win = function() {
		if(!this.victory){
			alert('Hoo boy you won!');
			this.victory = true;
			game.destructor();
			goToState('title');
			game.over = true;
		}
	};
	game.loss = false;
	game.lose = function() {
		if(!this.loss){
			alert('You succumbed to the cold vaccuum of space :(');
			this.loss = true;
			game.destructor();
			goToState('title');
			game.over = true;
		}
	}

	return game;

}

