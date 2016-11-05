function onDocumentReady() {
	stage = new Container();

	renderer = autoDetectRenderer(viewSize[0], viewSize[1], null);
	document.getElementById("gameCanvas").appendChild(renderer.view);

	loader.add("assets/images/tile0.png").add(
		"assets/images/tile1.png").add(
		"assets/images/tile2.png").add(
		"assets/images/tile3.png").add(
		"assets/images/tile4.png").add(
		"assets/images/tile5.png").add(
		"assets/images/tile6.png").add(
		"assets/images/tile7.png").add(
		"assets/images/tile8.png").add(
		"assets/images/tile9.png").add(
		"assets/images/connector0.png").add(
		"assets/images/connector1.png").add(
		"assets/images/file0.png").add(
		"assets/images/file1.png").add(
		"assets/images/file2.png").add(
		"background", "assets/images/background.png").load(setup);

	window.onbeforeunload = function () {
		saveCookies();
	};
}


function setup() {
	audioManager = new AudioManager();
	textures = TextureCache;

	// States setup

	states["menu"] = new Menu();
	states["gamePlay"] = new GamePlay();
 	states["gameOver"] = new GameOver();
	states["about"] = new About();
	states["settings"] = new Settings();

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
	var lastState = currentState;
	var newState = states[state];

	currentState = newState;

	if(lastState) {
		lastState.leave();
	}

	newState.enter();
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

	var moneyValue = Cookies.get("money");

	if(moneyValue) {
		money = parseInt(moneyValue);
	} else {
		money = 500;
	}

	updateMusicLevel();
	updateSoundsLevel();
}


function saveCookies() {
	Cookies.set("money", String(money));
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