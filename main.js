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

function extend(base, constructor) {
	var newClass = constructor || function(){base.apply(this, arguments);};
	newClass.prototype = Object.create(base.prototype);
	if(constructor) newClass.prototype.constructor = constructor;
	return newClass;
}
