function Settings() {
	this.gui = document.getElementById("settings");
	this.leave();
}

Settings.prototype.enter = function() {
	this.gui.style.display = "block";
};

Settings.prototype.leave = function() {
	this.gui.style.display = "none";
};

Settings.prototype.update = function() {

};