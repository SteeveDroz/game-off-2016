function Win() {
	this.gui = document.getElementById("win");
	this.scoreLabel = document.getElementById("scoreWin");

	this.leave();
}

Win.prototype.enter = function() {
	this.gui.style.display = "block";

	console.log("score: " + Math.max(filesPassed - filesLost, 0));

	this.scoreLabel.innerHTML = Math.max(filesPassed - filesLost, 0);

	achievementManager.unlock("firstTime");
};

Win.prototype.leave = function() {
	this.gui.style.display = "none";
};

Win.prototype.update = function() {

};