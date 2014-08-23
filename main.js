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
