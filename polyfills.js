var FPS = 30;
window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.oRequestAnimationFrame;

if(!window.requestAnimationFrame)
	window.requestAnimationFrame = function(callback) {
		return setTimeout(callback, 1000/FPS);
	};

CanvasRenderingContext2D.prototype.drawImageRotated = function(image, x, y, angle) {
	this.save();
	this.translate(x, y);
	this.rotate(angle);
	this.drawImage(image, -image.width/2, -image.height/2);
	this.restore();
}
