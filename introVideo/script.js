var ajax = new XMLHttpRequest();
ajax.open("GET", 'frames.json', true);

ajax.onload = function() {
	if(ajax.readyState == 4 && (ajax.status == 200 || ajax.status == 304))
		beginIntro(JSON.parse(ajax.responseText));
}

ajax.send();
function beginIntro(frames) {
	console.log(frames);
}
