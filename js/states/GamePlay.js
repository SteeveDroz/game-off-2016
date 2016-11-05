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

	stage.addChild(this.scene);

	map = new Map(10, 10, this.scene);
};

GamePlay.prototype.leave = function() {
	stage.removeChild(this.scene);

	gameOver = false;
	filesLost = 0;

	if(gameStarted) {
		startOrPauseGame();
	}

	this.gui.style.display = "none";
};

GamePlay.prototype.update = function() {
	map.update();

	this.cpuLabel.innerHTML = Math.floor((map.server.cpu / map.server.maxCpu) * 100) + "%";
	this.memLabel.innerHTML = Math.floor((map.server.memory / map.server.maxMemory) * 100) + "%";
	this.filesLost.innerHTML = filesLost;

	if(gameOver) {
		enterState("gameOver");
	}
};