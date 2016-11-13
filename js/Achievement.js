function Achievement(name, description, locked) {
	this.locked = locked;
	this.name = name;
	this.description = description;
}

Achievement.prototype.unlock = function() {
	if(!this.locked) {
		return;
	}

	this.locked = false;

	var achievementWrapper = document.getElementById("achievement");
	var achievementName = document.getElementById("achievementName");

	achievementWrapper.style.opacity = 1;
	achievementName.innerHTML = this.name;

	var self = this;

	achievementManager.draw();

	setTimeout(function() {
		achievementWrapper.style.opacity = 0;
	}, 5000);
};

function AchievementManager() {
	this.achievements = [];
	this.wrapper = document.getElementById("achievements");

	var firstTime = (Cookies.get("firstTime") == "true") ? false : true;

	this.achievements["firstTime"] = {
		achievement : new Achievement("My first time!", "Win the game for the first time", firstTime)
	};

	var morePower = (Cookies.get("morePower") == "true") ? false : true;

	this.achievements["morePower"] = {
		achievement : new Achievement("Need more power!", "Obtain a new server", morePower)
	};

	var cleanFreak  = (Cookies.get("cleanFreak") == "true") ? false : true;

	this.achievements["cleanFreak"] = {
		achievement : new Achievement("Clean freak!", "Obtain a trash", cleanFreak)
	};

	var stupidMusic = (Cookies.get("stupidMusic") == "true") ? false : true;

	this.achievements["stupidMusic"] = {
		achievement : new Achievement("Stupid music!", "Turn the music off", stupidMusic)
	};

	var titan = (Cookies.get("titan") == "true") ? false : true;

	this.achievements["titan"] = {
		achievement : new Achievement("Titan!", "Recive 200 files", titan)
	};

	// Money >= 1000

	this.draw();
}

AchievementManager.prototype.unlock = function(name) {
	this.achievements[name].achievement.unlock();
};

AchievementManager.prototype.save = function() {
	for(var ac in this.achievements) {
		Cookies.set(ac, String(this.achievements[ac].achievement.locked));
	}
};

AchievementManager.prototype.draw = function() {
	this.wrapper.innerHTML = "";

	for(var ac in this.achievements) {
		var inner = document.createElement("div");
		inner.setAttribute("id", "achievementsItem");

		if(!this.achievements[ac].achievement.locked) {
			var unlocked = document.createElement("span");
			unlocked.className = "unlocked";
			unlocked.innerHTML = "Unlocked"
			inner.appendChild(unlocked);
		}

		var name = document.createElement("div");
		name.innerHTML = this.achievements[ac].achievement.name;
		name.className = "white";

		var description = document.createElement("div");
		description.innerHTML = this.achievements[ac].achievement.description;
		description.className = "white";

		inner.appendChild(name);
		inner.appendChild(description);

		this.wrapper.appendChild(inner);
	}
};