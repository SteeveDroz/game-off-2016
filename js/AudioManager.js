function AudioManager() {
	this.music = {};
	this.sounds = {};
}

AudioManager.prototype.loadMusic = function(name, src, loop) {
	this.music[name] = new Howl({
		src : [ src ],
		loop : loop || true
	});
};

AudioManager.prototype.loadSound = function(name, src) {
	this.sounds[name] = new Howl({ src : [ src ] });
};

AudioManager.prototype.getMusic = function(name) {
	return this.music[name];
};

AudioManager.prototype.getSound = function(name) {
	return this.sounds[name];
};

AudioManager.prototype.muteAll = function() {
	this.muteMusic();
	this.muteSounds();
};

AudioManager.prototype.unmuteAll = function() {
	this.unmuteMusic();
	this.unmuteSounds();
};

AudioManager.prototype.unmuteMusic = function() {
	for(var melody in this.music) {
		if(this.music.hasOwnProperty(melody)) {
			var musicObject = this.music[melody];

			musicObject.mute(false);
			musicObject.play();
		}
	}
};

AudioManager.prototype.muteMusic = function() {
	for(var melody in this.music) {
		if(this.music.hasOwnProperty(melody)) {
			var musicObject = this.music[melody];

			musicObject.mute(true);
			musicObject.pause();
		}
	}
};

AudioManager.prototype.unmuteSounds = function() {
	for(var sound in this.sounds) {
		if(this.sounds.hasOwnProperty(sound)) {
			var soundObject = this.sounds[sound];

			soundObject.mute(false);
			soundObject.play();
		}
	}
};

AudioManager.prototype.muteSounds = function() {
	for(var sound in this.sounds) {
		if(this.sounds.hasOwnProperty(sound)) {
			var soundObject = this.sounds[sound];

			soundObject.mute(true);
			soundObject.pause();
		}
	}
};