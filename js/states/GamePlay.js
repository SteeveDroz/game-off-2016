function GamePlay() {
	this.scene = new Container();
	this.gui = document.getElementById("gamePlay");
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
	this.scene.x = Math.floor((window.innerWidth - 300 - this.scene.width) / 2);
	this.scene.y = Math.floor((window.innerHeight - this.scene.height) / 2);
};

GamePlay.prototype.nextWave = function() {
	wave++;

	fileSpeed *= 1.5;

	if(fileSpeed > 8) {
		fileSpeed = 8;
	}

	if(wave > 5) {
		enterState("win");
	}
};

GamePlay.prototype.enter = function() {
	this.gui.style.display = "block";

	stage.addChild(this.scene);

	gameOver = false;
	filesLost = 0;
	filesPassed = 0;

	map = new Map(10, 10, this.scene);
	shop = new Shop();

	this.resize();

	firstTime = false;
};

GamePlay.prototype.leave = function() {
	stage.removeChild(this.scene);

	if(gameStarted) {
		startOrPauseGame();
	}

	this.gui.style.display = "none";
};

GamePlay.prototype.update = function() {
	map.update();

	this.moneyLabel.innerHTML = money + "$";
	this.waveLabel.innerHTML = wave;

	if(gameOver) {
		enterState("gameOver");
	}
};