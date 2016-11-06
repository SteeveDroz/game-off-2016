function GamePlay() {
	this.scene = new Container();
	this.gui = document.getElementById("gamePlay");
	this.cpuLabel = document.getElementById("serverCPU");
	this.memLabel = document.getElementById("serverMEM");
	this.filesLost = document.getElementById("filesLost");
	this.moneyLabel = document.getElementById("money");
	this.waveLabel = document.getElementById("wave");

	this.leave();

	wave = 0;

	this.nextWave();

	var self = this;

	setInterval(function() {
		if(gameStarted) {
			self.nextWave();
		}
	}, 60000);

	window.addEventListener("resize", function(event) {
		self.resize();
	}, false);
}

GamePlay.prototype.resize = function() {
	this.scene.x = Math.floor((window.innerWidth - this.scene.width) / 2);
	this.scene.y = Math.floor((window.innerHeight - this.scene.height) / 2);
};

GamePlay.prototype.nextWave = function() {
	wave++;

	fileSpeed *= 1.5;

	if(fileSpeed > 8) {
		fileSpeed = 8;
	}

	if(wave >= 10) {
		enterState("win");
	}
};

GamePlay.prototype.enter = function() {
	this.gui.style.display = "block";

	stage.addChild(this.scene);

	map = new Map(10, 10, this.scene);
	shop = new Shop();

	this.resize();

	firstTime = false;
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
	this.moneyLabel.innerHTML = money + "$";
	this.waveLabel.innerHTML = wave;

	if(gameOver) {
		enterState("gameOver");
	}
};