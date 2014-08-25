(function(scope) {
	window.AudioContext = window.AudioContext || window.webkitAudioContext;

	scope.audioCtx = new window.AudioContext();

	scope.sounds = {};
	var toLoad = [];

	function gotSound(i) {
		toLoad.splice(toLoad.indexOf(i), 1);
		if(!toLoad.length)
			document.dispatchEvent(new CustomEvent("soundsLoaded"));
	}

	scope.loadSound = function(name, url) {
		var source = scope.audioCtx.createBufferSource();
		var ajax = new XMLHttpRequest();

		ajax.open('GET', url, true);

		ajax.responseType = 'arraybuffer';

		ajax.onload = function() {
			var audioData = ajax.response;
			audioCtx.decodeAudioData(audioData, function(buffer) {
				source.buffer = buffer;

				source.connect(audioCtx.destination);
				scope.sounds[name] = buffer;
			},
			function(error){"ERROR'D " + error.err});

		}

		ajax.send();
	}
})(window);

var soundHandles = {
	/* Songs */
	titleScreen: "sounds/title screen.ogg",
	storyTime: "sounds/storytime.ogg",

	/* In-game tracks */
	guitar: "sounds/sleepy guitars only.ogg",
	smallDrums: "sounds/sleepy no bass smaller drums.ogg",
	drumsAndBass: "sounds/sleepy only bass and bigger drums.ogg",

	/* SFX */
	charging: "sounds/sfx/charging.ogg",
	getAwayFromTheDamnSun: "sounds/sfx/get-away-from-the-damn-sun.ogg",
	landing: "sounds/sfx/landing.ogg",
	liftoff: "sounds/sfx/liftoff.ogg",
	planetsCollide: "sounds/sfx/planets-collide.ogg",
	planetsConnected: "sounds/sfx/planets-connected.ogg",
	ropeSnap: "sounds/sfx/rope-snap.ogg",
	selectBonusPoints: "sounds/sfx/select-bonus-points.ogg",
	selectBonusPoints2: "sounds/sfx/select-bonus-points-2.ogg",
	winchLettingOut: "sounds/sfx/winch-letting-out.ogg",
	winchPullingIn: "sounds/sfx/winch-pulling-in.ogg"
}

for(var name in soundHandles) {
	window.loadSound(name, soundHandles[name]); 
}

function playSound(buffer) {
	var src = audioCtx.createBufferSource();
	src.buffer = buffer;
	src.connect(audioCtx.destination);
	src.start(0);
	return src;
}

function getSoundSource(buffer) {
	var src = audioCtx.createBufferSource();
	src.buffer = buffer;
	return src;
}