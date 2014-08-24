(function(scope) {
	scope.images = {};
	var toload = [];

	function gotImage(i) {
		toload.splice(toload.indexOf(i), 1);
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
	ship: "images/ship.png",
	background: "images/spacebg.png",
	stars: "images/background.png",
	wheel: "images/winch_wheel.png"
};

for(var name in imageHandles) {
	window.loadImage(name, imageHandles[name]);
}
