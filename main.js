var b2Vec2 = Box2D.Common.Math.b2Vec2,
	b2BodyDef = Box2D.Dynamics.b2BodyDef,
	b2Body = Box2D.Dynamics.b2Body,
	b2FixtureDef = Box2D.Dynamics.b2FixtureDef,
	b2Fixture = Box2D.Dynamics.b2Fixture,
	b2World = Box2D.Dynamics.b2World,
	b2MassData = Box2D.Collision.Shapes.b2MassData,
	b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape,
	b2CircleShape = Box2D.Collision.Shapes.b2CircleShape,
	b2DebugDraw = Box2D.Dynamics.b2DebugDraw;

function init() {
	var canvas = document.querySelector('canvas');

	var lastTime = new Date();

	var game = window.game = new Game();

	function main() {
		game.tick();
		requestAnimationFrame(main);
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
	return Math.atan2(deltaY, deltaX);
}

function PolarToRectangular(direction, magnitude) {
	return {
		x: magnitude * Math.cos(direction),
		y: magnitude * Math.sin(direction)
	};
}

function InterpolatePositions(from, to, amount) {
	return {
		x: to.x * amount + from.x * (1 - amount),
		y: to.y * amount + from.y * (1 - amount) 
	};
}
