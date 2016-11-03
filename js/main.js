function onDocumentReady() {
	stage = new Container();

	renderer = autoDetectRenderer(viewSize[0], viewSize[1], null);
	document.getElementById("gameCanvas").appendChild(renderer.view);

	loader.add("assets/images/tile0.png").add(
		"assets/images/tile1.png").add(
		"assets/images/tile2.png").add(
		"assets/images/tile3.png").add(
		"assets/images/tile4.png").add(
		"assets/images/connector0.png").add(
		"assets/images/connector1.png").add(
		"assets/images/connection.png").add(
		"background", "assets/images/background.png").load(setup);

	window.onresize = function() {
		resize();
	};
}

function setup() {
	audioManager = new AudioManager();
	textures = TextureCache;

	console.log(textures);

	// States setup

	states["menu"] = new Menu();
	states["gamePlay"] = new GamePlay();
	states["about"] = new About();
	states["settings"] = new Settings();

	resize();

	audioManager.loadMusic("background", "assets/music/Sierra Nevada.mp3");
	audioManager.getMusic("background").play();

	applyCookies();
	enterState("menu");

	update(); // Loops forever
}

function update() {
	requestAnimationFrame(update);

	currentState.update();
	renderer.render(stage);
}

function enterState(state) {
	if(currentState != undefined) {
		currentState.leave();
	}

	var newState = states[state];

	newState.enter();

	currentState = newState;
}

function updateMusicLevel() {
	if(document.getElementById("music").checked) {
		audioManager.unmuteMusic();
	} else {
		audioManager.muteMusic();
	}
}

function updateSoundsLevel() {
	if(document.getElementById("sounds").checked) {
		audioManager.unmuteSounds();
	} else {
		audioManager.muteSounds();
	}
}

function applyCookies() {
	document.getElementById("music").checked = (Cookies.get("music") == "true") ? true : false;
	document.getElementById("sounds").checked = (Cookies.get("sounds") == "true") ? true : false;

	updateMusicLevel();
	updateSoundsLevel();
}

function updateCookie(cookie) {
	switch(cookie) {
		case "music":
			var checked = document.getElementById("music").checked;

			Cookies.set("music", checked);

			updateMusicLevel();
		break;
		case "sounds":
			var checked = document.getElementById("sounds").checked;

			Cookies.set("sounds", checked);

			updateSoundsLevel();
		break;
	}
}

function resize() {
	// var width = 0;
	// var height = 0;
	//
	// if(window.innerWidth / window.innerHeight >= ratio) {
	// 	width = window.innerHeight * ratio;
	// 	height = window.innerHeight;
	// } else {
	// 	width = window.innerWidth;
	// 	height = window.innerWidth / ratio;
	// }
	//
	// console.log(renderer);
	//
	// renderer.view.style.width = width + 'px';
	// renderer.view.style.height = height + 'px';
}