var _toLoad = 2;
var _titleScreenMusic = null;

document.addEventListener('imagesloaded', function() { loadedAThing();});
document.addEventListener('soundsloaded', function() { loadedAThing();});

function loadedAThing() {
	_toLoad--;
	if(!_toLoad) {
		document.getElementById('loadingbars').style.display = 'none';
		document.getElementById('menu').style.display = 'block';

		document.getElementById('play-game-button').addEventListener('click', function() {
			startALevel(null);
		});

		_titleScreenMusic = playSound(sounds.titleScreen);
	}
}



function startALevel(level) {
	_titleScreenMusic.stop();
	_titleScreenMusic = null;
	startGame(level);
}
