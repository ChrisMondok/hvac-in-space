var _toLoad = 2;
var _music = null;
var _image = 0;
var _interval = null;

var companyNames = [ 'Malcorp', 'Zangrathar Inc.', 'Xenophyte LLC', 'Goliath Industries Ltd.', 'Scarab Corp', 'Exoward LLC', 'PotatoCorp', 'Syn Co', 'Behemoth Conglomerate Inc', 'Obfuscorp', 'Transylcorp', 'Garanthax LTD', 'Coldian Industries', 'Jezuptrom Inc.', 'Xyrtril Co.', 'Quiphibrt Inc.', 'Grimm Realities Inc.', 'Faust Ltd.' ];

var greek = [ 'Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon', 'Zeta', 'Eta', 'Theta', 'Iota', 'Kappa', 'Lambda', 'Mu' ];
var food = [ 'Acai', 'Apple', 'Apricot', 'Banana', 'Cherry', 'Coconut', 'Cucumber', 'Fig', 'Gooseberry', 'Grapefruit', 'Grape', 'Kiwi', 'Kumquat', 'Lemon', 'Lime', 'Lychee', 'Mango', 'Melon', 'Mulberry', 'Nectarine', 'Orange', 'Papaya', 'Peach', 'Pear', 'Pineapple', 'Plum', 'Pomegranate', 'Prickly Pear', 'Prune', 'Raspberry', 'Strawberry', 'Tangerine', 'Watermelon' ];
var planets = [ 'Sirius', 'Canopus', 'Arcturus', 'Alpha Centauri A', 'Vega', 'Rigel', 'Procyon', 'Achernar', 'Betelgeuse', 'Hadar', 'Capella A', 'Altair', 'Aldebaran', 'Capella B', 'Spica', 'Antares', 'Pollux', 'Fomalhaut', 'Deneb', 'Mimosa', ];

document.addEventListener('imagesloaded', function() { loadedAThing();});
document.addEventListener('soundsloaded', function() { loadedAThing();});

function loadedAThing() {
	_toLoad--;
	if(!_toLoad) {
		document.getElementById('loadingbars').style.display = 'none';
		goToState('title');

		document.getElementById('play-game-button').addEventListener('click', function() {
			goToState('game');
			startALevel(null);
		});

		document.getElementById('instructions-button').addEventListener('click', function() {
			doInstructions();
		});

		document.getElementById('next-button').addEventListener('click', next);
		document.getElementById('menu-button').addEventListener('click', function() {goToState('title')});
	}
}

function goToState(state) {
	document.body.className = state;

	if(_music)
		_music.stop();

	_music = null;

	if(state == 'title')
		_music = playSound(sounds.titleScreen);

	if(state == 'instructions')
		_music = playSound(sounds.storyTime);
}

function startALevel(level) {
	startGame();
}

function doInstructions() {
	goToState('instructions');
	_image = 3;
	nextImage();

	if(_interval)
		clearInterval(_interval);

	setTimeout(nextImage, 3000);

	document.getElementById('companyName').innerHTML = pickRandom(companyNames);
	document.getElementById('sectorName').innerHTML = pickSector();

	document.getElementsByTagName('figure')[0].style.display = 'block';
	document.getElementsByTagName('figure')[1].style.display = 'none';
}

function next() {
	_image = 3;
	_interval = setInterval(nextImage, 3000);
	document.getElementsByTagName('figure')[0].style.display = 'none';
	document.getElementsByTagName('figure')[1].style.display = 'block';
}

function nextImage(number) {
	_image = (_image + 1) % 4;
	document.getElementById('instructions').className = String.fromCharCode(97 + _image);
}

function pickSector() {
	return [pickRandom(greek),pickRandom(food),Math.floor(Math.random() * 100)].join('-')
		+ " Quadrant of "
		+ pickRandom(planets)+ " " + Math.floor(Math.random() * 10);
}

function pickRandom(arr) {
	return arr[Math.floor(Math.random() * arr.length)];
}
