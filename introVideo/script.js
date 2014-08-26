window.addEventListener('load', function() {
	this.canvas = document.createElement('canvas');
	this.ctx = this.canvas.getContext('2d');
	this.canvas.width = 600;
	this.canvas.height = 468;
	document.body.appendChild(this.canvas);

	var	ajax = new XMLHttpRequest();
	ajax.open("GET", 'frames.json', true);

	ajax.onload = function() {
		if(ajax.readyState == 4 && (ajax.status == 200 || ajax.status == 304))
			beginIntro(JSON.parse(ajax.responseText));
	}

	ajax.send();
});
function beginIntro(frames) {
	this.image = new Image();
	this.image.src = 'metroid.jpg';

	var i = 0;
	this.interval = setInterval(function() {
		drawFrame(this.ctx, this.image, i);
		i += 0.2;
		if(i>1)
			clearInterval(window.interval);
	}, 600);	
}

function drawFrame(ctx, image, opacity) {
	console.log("draw!");
	ctx.clearRect(0,0,this.canvas.width, this.canvas.height);
	this.ctx.fillStyle = 'black';
	this.ctx.fillRect(0,0,this.canvas.width,this.canvas.height);

	this.ctx.save();
	this.ctx.globalAlpha = opacity;
	this.ctx.drawImage(image, 0,0);
	this.ctx.restore();
}
