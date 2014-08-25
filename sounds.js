(function(scope) {
	window.AudioContext = window.AudioContext || window.webkitAudioContext;

	scope.audioCtx = new window.AudioContext();

	scope.sounds = {};
	var toLoad = [];

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

				var percent = Object.keys(scope.sounds).length / Object.keys(soundHandles).length;
				document.getElementById('audio-meter').value = percent;

				if(percent == 1)
					document.dispatchEvent(new CustomEvent("soundsloaded"));
			},
			function(error){console.error("Something broke.");});

		}

		ajax.send();
	}

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
		ropeSnap: "sounds/sfx/rope snap.ogg",
		selectBonusPoints: "sounds/sfx/select-bonus-points.ogg",
		selectBonusPoints2: "sounds/sfx/select-bonus-points-2.ogg",
		winchLettingOut: "sounds/sfx/winch-letting-out.ogg",
		winchPullingIn: "sounds/sfx/winch-pulling-in.ogg",
		powerUp: "sounds/sfx/powering uuuuup.ogg",

		/* Winch sfx */
		winch1: "sounds/sfx/winch 1.ogg",
		winch2: "sounds/sfx/winch 2.ogg",
		winch3: "sounds/sfx/winch 3.ogg",
		winch4: "sounds/sfx/winch 4.ogg",

	}

	for(var name in soundHandles) {
		window.loadSound(name, soundHandles[name]); 
	}

})(window);

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

