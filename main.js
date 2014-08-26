function init() {
	var canvas = document.querySelector('canvas');

	var lastTime = new Date();

}

function startGame(level) {
	//var game = window.game = new Game();
	var game = window.game = level3();

	function main() {
		if(game) {
			game.tick();
			requestAnimationFrame(main);
		}
	}

	main();
}

window.addEventListener('load', init);

var types = {};

function extend(base, constructor) {
	if(!constructor)
		throw new TypeError('You need to provide a constructor');
	//var newClass = constructor || function (){base.apply(this, arguments);};
	constructor.prototype = Object.create(base.prototype);
	constructor.prototype.constructor = constructor;
	if(constructor.name) {
		console.log('Defined '+constructor.name);
		types[constructor.name] = constructor;
	}
	return constructor;
}

function MixInto(destination, mixin) {
	var mixInFunction = function(name) {
		console.log('Mixing in function named '+name);
		var ownProperty = destination[property];
		destination[name] = function() {
			ownProperty.apply(this, arguments);
			mixin.prototype[name].apply(this, arguments);
		};
	}

	for(var property in mixin.prototype) {
		if(!mixin.prototype.hasOwnProperty(property))
			continue;

		if(property in destination) {
			if(destination[property] instanceof Function)
				mixInFunction(property);
			else
				console.warn('Not overwriting '+property);
		}
		else
			destination[property] = mixin.prototype[property];
	}
}

function RectangularToPolar(deltaX, deltaY) {
	return Math.atan2(-deltaY, deltaX);
}

function Magnitude(x, y) {
	return Math.sqrt(x * x + y * y);
}

function PolarToRectangular(direction, magnitude) {
	return {
		x: magnitude * Math.cos(direction),
		y: - magnitude * Math.sin(direction)
	};
}

function InterpolatePositions(from, to, amount) {
	return {
		x: to.x * amount + from.x * (1 - amount),
		y: to.y * amount + from.y * (1 - amount) 
	};
}

function PointDistance(x1, y1, x2, y2) {
	return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

//expects "circleLike" to have x, y, and radius
function CircleIntersectsLineSegment(circleLike, x1, y1, x2, y2) {
	if(PointDistance(circleLike.x, circleLike.y, x1, y1) < circleLike.radius)
		return true;
	
	if(PointDistance(circleLike.x, circleLike.y, x2, y2) < circleLike.radius)
		return true;

	var angleToCircle = RectangularToPolar(circleLike.x - x1, circleLike.y - y1)
	var angleOfLine = RectangularToPolar(x2 - x1, y2 - y1);
	var lengthOfLine = PointDistance(x1, y1, x2, y2);
	var distanceFrom1ToCircle = PointDistance(x1, y1, circleLike.x, circleLike.y);

	var whatIsThisCalled = PolarToRectangular(angleToCircle - angleOfLine, distanceFrom1ToCircle);

	var distanceAlongLine = whatIsThisCalled.x;
	var distanceFromLine = whatIsThisCalled.y;

	if(distanceAlongLine < 0 || distanceAlongLine > lengthOfLine)
		return false;
	if(Math.abs(distanceFromLine) > circleLike.radius)
		return false;

	return true;
}
