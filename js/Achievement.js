function Achievement(name, description, locked) {
	this.locked = locked;
	this.name = name;
	this.description = description;
}

Achievement.prototype.unlock = function() {
	if(!this.locked) {
		return;
	}

	var achievementWrapper = document.getElementById("achievement");
	var achievementName = document.getElementById("achievementName");

	achievementWrapper.style.opacity = 1;
	achievementName.innerHTML = this.name;

	var self = this;

	setTimeout(function() {
		achievementWrapper.style.opacity = 0;
	}, 5000);
};

function AchievementManager() {
	this.achievements = [];

	var firstTime = (Cookies.get("firstTime") == "true") ? false : true;

	this.achievements["firstTime"] = {
		achievement : new Achievement("My first time!", "Win the game for the first time", firstTime)
	};

	var morePower = (Cookies.get("morePower") == "true") ? false : true;

	this.achievements["morePower"] = {
		achievement : new Achievement("Need more power!", "Obtain new server", morePower)
	};
}

AchievementManager.prototype.unlock = function(name) {
	this.achievements[name].achievement.unlock();
};

AchievementManager.prototype.save = function() {
	for(var ac in this.achievements) {
		Cookies.set(ac, String(this.achievements[ac].achievement.locked));
	}
};