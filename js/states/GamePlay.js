function GamePlay() {
	this.scene = new Container();
	this.gui = document.getElementById("gamePlay");

	stage.addChild(this.scene);

	this.leave();
}

GamePlay.prototype.enter = function() {
	stage.children.forEach(function(child) {
		// child.visible = false;
	});

	this.scene.visible = true;
	this.gui.style.display = "block";
};

GamePlay.prototype.leave = function() {
	this.scene.visible = false;
	this.gui.style.display = "none";
};

GamePlay.prototype.update = function() {

};