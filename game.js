function init() {
	var canvas = document.querySelector("canvas");

	function resizeCanvas() {
		canvas.setAttribute("width", canvas.offsetWidth);
		canvas.setAttribute("height", canvas.offsetHeight);
	}

	resizeCanvas();

	window.addEventListener("resize", resizeCanvas);
}

window.addEventListener("load", init);
