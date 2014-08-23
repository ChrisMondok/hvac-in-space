function init() {
	var canvas = document.querySelector("canvas");

	function resizeCanvas() {
		canvas.setAttribute("width", canvas.offsetWidth);
		canvas.setAttribute("height", canvas.offsetHeight);
	}

	resizeCanvas();

	window.addEventListener("resize", resizeCanvas);

	var lastTime = new Date();

	function main() {
		var dt = new Date() - lastTime;

		requestAnimationFrame(main);
	}

	main();


}

window.addEventListener("load", init);
