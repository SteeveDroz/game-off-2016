function GamePlay() {
	this.scene = new Container();
	this.gui = document.getElementById("gamePlay");

	this.leave();
}

GamePlay.prototype.enter = function() {
	this.gui.style.display = "block";
	this.server
	this.map = new Map(10, 10, this.scene);

	stage.addChild(this.scene);
};

GamePlay.prototype.leave = function() {
	stage.removeChild(this.scene);

	this.gui.style.display = "none";
};

GamePlay.prototype.update = function() {
	this.map.update();

	if(gameOver) {
		enterState("menu");
	}
};