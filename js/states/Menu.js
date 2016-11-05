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

	var self = this;

	window.addEventListener("resize", function(event) {
		self.resize();
	}, false);
}

Menu.prototype.resize = function() {
	this.background.width = window.innerWidth;
	this.background.height = window.innerWidth / ratio;

	this.background.x = (this.background.width - window.innerWidth) / 2 * -1;
	this.background.y = (this.background.height - window.innerHeight) / 2 * -1;
};

Menu.prototype.enter = function() {
	stage.addChild(this.scene);

	this.scene.visible = true;
	this.gui.style.display = "block";
};

Menu.prototype.leave = function() {
	if(currentState instanceof GamePlay) {
		stage.removeChild(this.scene);

		this.scene.visible = false;
	}

	this.gui.style.display = "none";
};

Menu.prototype.update = function() {

};