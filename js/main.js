var viewSize = [1280, 720];
var ratio = viewSize[0] / viewSize[1];
var stage;
var renderer;

var states = {};
var currentState;
var gameScene;
var gameOverScene;
var textures;
var background;

var audioManager;

function onDocumentReady() {
	audioManager = new AudioManager();
	stage = new Container();
	renderer = autoDetectRenderer(viewSize[0], viewSize[1]);

	document.getElementById("gameCanvas").appendChild(renderer.view);

	loader.add("ggo.json", "assets/images/ggo.json").add(
		"background", "assets/images/background.png").load(setup);
}

function setup() {
	textures = resources["ggo.json"].textures;

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
	var width = window.innerWidth;
	var height = window.innerHeight;

	renderer.view.style.width = width + 'px';
	renderer.view.style.height = height + 'px';
}

window.onresize = function(event) {
	resize();
};