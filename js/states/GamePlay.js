function GamePlay() {
	this.scene = new Container();
	this.gui = document.getElementById("gamePlay");
	this.moneyLabel = document.getElementById("money");
	this.waveLabel = document.getElementById("wave");
	this.nextWaveLabel = document.getElementById("nextWave");
	this.nextWaveNumberLabel = document.getElementById("nextWaveNumber");
	this.countdownLabel = document.getElementById("nextWaveCountdown");
	this.countdownLabelNumber = document.getElementById("nextWaveTime");
	this.serverQuality = document.getElementById("serverQuality");

	this.leave();

	var self = this;
	gameStarted = true;
	this.countdown = 10;

	setInterval(function() {
		if(!gameStarted) {
			self.countdown--;
			self.countdownLabel.style.display = "block";
			self.countdownLabelNumber.innerHTML = self.countdown;

			if(self.countdown == 0) {
				self.countdownLabel.style.display = "none";

				self.nextWave();
			}
		}
	}, 1000);

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

	this.nextWaveLabel.style.opacity = 1;
	this.nextWaveNumberLabel.innerHTML = wave;

	var self = this;
	gameStarted = true;

	setTimeout(function() {
		self.nextWaveLabel.style.opacity = 0;
	}, 3000);

	setInterval(function() {
		if(filesStoped) {
			gameStarted = false;
			filesStoped = false;
			self.countdown = 10;
		}
	}, 1000);

	fileSpeed *= 1.25;

	if(fileSpeed > 8) {
		fileSpeed = 8;
	}

	if(wave > 5) {
		money += 1000 + filesPassed;

		enterState("win");
	}
};

GamePlay.prototype.enter = function() {
	this.gui.style.display = "block";

	stage.addChild(this.scene);

	wave = 0;

	gameOver = false;
	gameStarted = false;
	filesLost = 0;
	filesPassed = 0;

	map = new Map(10, 10, this.scene);
	shop = new Shop();

	this.resize();

	firstTime = false;
};

GamePlay.prototype.leave = function() {
	stage.removeChild(this.scene);

	this.gui.style.display = "none";
};

GamePlay.prototype.update = function() {
	map.update();

	this.moneyLabel.innerHTML = money + "$";
	this.waveLabel.innerHTML = wave;

	var quality = filesPassed / filesLost;

	if(!isFinite(quality)) {
		if(filesLost == 0) {
			quality = 1;
		} else {
			quality = 0;
		}
	}

	this.serverQuality.value = quality;

	if(gameOver) {
		enterState("gameOver");
	}
};