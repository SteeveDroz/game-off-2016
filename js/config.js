var Container = PIXI.Container;
var autoDetectRenderer = PIXI.autoDetectRenderer;
var loader = PIXI.loader;
var resources = PIXI.loader.resources;
var TextureCache = PIXI.utils.TextureCache;
var Texture = PIXI.Texture;
var Sprite = PIXI.Sprite;
var Text = PIXI.Text;
var Graphics = PIXI.Graphics;

var viewSize = [1920, 1080];
var ratio = viewSize[0] / viewSize[1];
var stage;
var renderer;

var states = {};
var currentState;
var gameScene;
var mapScene;
var gameOverScene;
var textures;
var background;

var audioManager;
var gameOver = false;
var gameStarted = false;

var map;
var wireColor = 0x06e6ff;

var filesLost = 0;
var fileSpeed = 0.5;

var connectors = [];
var connections = [];

function getClickX(event) {
	var x;

	if(event.pageX || event.pageY) {
		x = event.pageX;
	} else {
		x = event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
	}

	return x;
}

function getClickY(event) {
	var y;

	if(event.pageX || event.pageY) {
		y = event.pageY;
	} else {
		y = event.clientY + document.body.scrollTop + document.documentElement.scrollTop;
	}

	return y;
}

function isInside(x, y, width, height, px, py) {
	return (px >= x && px <= x + width && py >= y && py <= y + height);
}

function emptyConstructor() {

}

function extend(base, sub) {
	emptyConstructor.prototype = base.prototype;
	sub.prototype = new emptyConstructor();
	sub.prototype.constructor = sub;
}

function startOrPauseGame() {
	gameStarted = !gameStarted;

	var button = document.getElementById("start");
	button.innerHTML = (gameStarted) ? "Pause" : "Start";
}