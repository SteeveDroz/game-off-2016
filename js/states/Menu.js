function Menu() {
	this.scene = new Container();
	this.gui = document.getElementById("menu");

	var background = new Sprite(loader.resources["background"].texture);

	background.x = 0;
	background.y = 0;

	this.background = background;

	this.scene.addChild(background);
	stage.addChild(this.scene);

	this.leave();
}

Menu.prototype.enter = function() {
	stage.addChild(this.scene);

	this.scene.visible = true;
	this.gui.style.display = "block";
};

Menu.prototype.leave = function() {
	stage.removeChild(this.scene);

	this.scene.visible = false;
	this.gui.style.display = "none";
};

Menu.prototype.update = function() {

};