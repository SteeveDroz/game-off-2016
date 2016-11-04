function GamePlay() {
	this.scene = new Container();
	this.gui = document.getElementById("gamePlay");
	this.cpuLabel = document.getElementById("serverCPU");
	this.memLabel = document.getElementById("serverMEM");
	this.filesLost = document.getElementById("filesLost");

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

	this.cpuLabel.innerHTML = Math.floor((this.map.server.cpu / this.map.server.maxCpu) * 100) + "%";
	this.memLabel.innerHTML = Math.floor((this.map.server.memory / this.map.server.maxMemory) * 100) + "%";
	this.filesLost.innerHTML = filesLost;

	if(gameOver) {
		enterState("menu");
	}
};