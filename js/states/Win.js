function Win() {
	this.gui = document.getElementById("win");
	this.leave();
}

Win.prototype.enter = function() {
	this.gui.style.display = "block";

	console.log("score: " + Math.max(filesPassed - filesLost, 0));
};

Win.prototype.leave = function() {
	this.gui.style.display = "none";
};

Win.prototype.update = function() {

};