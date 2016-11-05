function GameOver() {
	this.gui = document.getElementById("gameOver");
	this.leave();
}

GameOver.prototype.enter = function() {
	this.gui.style.display = "block";
};

GameOver.prototype.leave = function() {
	this.gui.style.display = "none";
};

GameOver.prototype.update = function() {

};