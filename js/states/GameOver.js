function GameOver() {
	this.gui = document.getElementById("gameOver");
	this.whyLabel = document.getElementById("why");
	this.scoreLabel = document.getElementById("scoreOver");

	this.leave();
}

GameOver.prototype.enter = function() {
	this.gui.style.display = "block";

	console.log("score: " + Math.max(filesPassed - filesLost, 0));

	this.scoreLabel.innerHTML = Math.max(filesPassed - filesLost, 0);

	var s = (map.servers.length > 1) ? "s" : "";

	var self = this;

	map.servers.forEach(function(server) {
		if(server.infected) {
			self.whyLabel.innerHTML = "Your server" + s + " got a virus.";
		} else if(server.hacked) {
			self.whyLabel.innerHTML = "Your server" + s + " " + ((map.servers.length > 1) ? "are" : "is") + " hacked";
		} else if(server.dead) {
			if(server.memory >= server.maxMemory) {
				self.whyLabel.innerHTML = "Your server" + s + " run out of memory.";
			} else {
				self.whyLabel.innerHTML = "Your server" + s + " CPU is overloaded.";
			}
		}
	});
};

GameOver.prototype.leave = function() {
	this.gui.style.display = "none";
};

GameOver.prototype.update = function() {

};