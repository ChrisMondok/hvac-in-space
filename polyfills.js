var FPS = 30;
window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.oRequestAnimationFrame;

if(!window.requestAnimationFrame)
	window.requestAnimationFrame = function(callback) {
		return setTimeout(callback, 1000/FPS);
	};
