var Container = PIXI.Container;
var autoDetectRenderer = PIXI.autoDetectRenderer;
var loader = PIXI.loader;
var resources = PIXI.loader.resources;
var TextureCache = PIXI.utils.TextureCache;
var Texture = PIXI.Texture;
var Sprite = PIXI.Sprite;
var Text = PIXI.Text;
var Graphics = PIXI.Graphics;

var viewSize = [1280, 720];
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

function remove(array, element) {
	var index = array.indexOf(element);
	array.splice(index);
}
