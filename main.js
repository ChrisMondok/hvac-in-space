function init() {
	var canvas = document.querySelector("canvas");

	var lastTime = new Date();

	var game = window.game = new Game();

	function main() {
		game.tick();
		requestAnimationFrame(main);
	}

	main();
}

window.addEventListener("load", init);

var types = {};

function extend(base, constructor) {
	if(!constructor)
		throw new TypeError("You need to provide a constructor");
	//var newClass = constructor || function (){base.apply(this, arguments);};
	constructor.prototype = Object.create(base.prototype);
	constructor.prototype.constructor = constructor;
	if(constructor.name) {
		console.log("Defined "+constructor.name);
		types[constructor.name] = constructor;
	}
	return constructor;
}
