function About() {
	this.gui = document.getElementById("about");
	this.leave();
}

About.prototype.enter = function() {
	this.gui.style.display = "block";
};

About.prototype.leave = function() {
	this.gui.style.display = "none";
};

About.prototype.update = function() {

};
