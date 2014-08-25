(function(scope) {
	scope.images = {};
	var toload = [];

	function gotImage(i) {
		toload.splice(toload.indexOf(i), 1);
		document.getElementById('image-meter').value = 1-(toload.length / Object.keys(imageHandles).length);
		if(!toload.length)
			document.dispatchEvent(new CustomEvent("imagesloaded"));
	}

	scope.loadImage = function(name, url) {
		var img = document.createElement('img');
		scope.images[name] = img;
		toload.push(img);
		img.addEventListener("load", function() {gotImage(img)});

		img.src = url;
	}
})(window);

var imageHandles = {
	bluePlanet: "images/blue_planet.png",
	redPlanet: "images/red_planet.png",
	sun: "images/sun.png",
	shipLeft: "images/ship_left.png",
	shipRight: "images/ship_right.png",
	shipTop: "images/ship_topdown.png",
	background: "images/spacebg.png",
	stars: "images/background.png",
	wheel: "images/winch_wheel.png",
	zxcvZ: "images/zxcv_z.png",
	zxcvX: "images/zxcv_x.png",
	zxcvC: "images/zxcv_c.png",
	zxcvV: "images/zxcv_v.png",
};

for(var name in imageHandles) {
	window.loadImage(name, imageHandles[name]);
}
