function Win() {
	this.gui = document.getElementById("win");
	this.leave();
}

Win.prototype.enter = function() {
	this.gui.style.display = "block";
};

Win.prototype.leave = function() {
	this.gui.style.display = "none";
};

Win.prototype.update = function() {

};