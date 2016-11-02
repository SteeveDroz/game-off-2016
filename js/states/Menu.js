function Menu() {
	this.scene = new Container();
	this.gui = document.getElementById("menu");

	stage.addChild(this.scene);

	var background = new Sprite(loader.resources["background"].texture);

	background.x = 0;
	background.y = 0;


	this.background = background;

	stage.addChild(background);

	this.leave();
}

Menu.prototype.enter = function() {
	stage.children.forEach(function(child) {
		// child.visible = false;
	});

	this.scene.visible = true;
	this.gui.style.display = "block";
};

Menu.prototype.leave = function() {
	this.scene.visible = false;
	this.gui.style.display = "none";
};

Menu.prototype.update = function() {

};