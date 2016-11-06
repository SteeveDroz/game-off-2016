function GameOver() {
	this.gui = document.getElementById("gameOver");
	this.whyLabel = document.getElementById("why");
	this.scoreLabel = document.getElementById("scoreOver");
	this.leave();
}

GameOver.prototype.enter = function() {
	this.gui.style.display = "block";

	if(map.server.cpu > map.server.maxCpu) {
		this.whyLabel.innerHTML = "Your server's CPU is overloaded.";
	} else if(map.server.memory > map.server.maxMemory) {
		this.whyLabel.innerHTML = "Your server run out of memory.";
	} else if(map.server.infected) {
		this.whyLabel.innerHTML = "Your server caught a virus.";
	}

	this.scoreLabel.innerHTML = Math.max(filesPassed - filesLost, 0);
};

GameOver.prototype.leave = function() {
	this.gui.style.display = "none";
};

GameOver.prototype.update = function() {

};