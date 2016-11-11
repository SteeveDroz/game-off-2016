var TileType =  {
	NONE : 0,
	MACHINE : 1,
	SERVER : 2,
	WIRE : 3,
	ETHERNET_CONNECTOR : 4,
	SCANNER : 5,
	LINE_CONNECTOR : 6,
	ANTIVIRUS : 7,
	TRASH : 8,
	SWITCH : 9,
	AUTO_SWITCH : 10,
	DELAYER : 11
};

var ConnectorType = {
	IN : 0,
	OUT : 1
};

var FileType = {
	NORMAL : 1,
	VIRUS : 2,
	SQL_SCRIPT : 3
};

function File(type) {
	this.type = type;
	this.known = false;
	this.size = Math.floor(Math.random() * 5) + 1;
	this.sprite = new Sprite(textures["assets/images/file" + ((this.known) ? this.type : 0) + ".png"]);
	this.moving = false;
	this.target = null;
	this.connection = null;
}

File.prototype.scan = function() {
	if(!this.known) {
		this.known = true;
		this.sprite = new Sprite(textures["assets/images/file" + (this.type) + ".png"]);
	}
};

File.prototype.show = function() {
	mapScene.addChild(this.sprite);
};

File.prototype.hide = function() {
	mapScene.removeChild(this.sprite);
};

File.prototype.setPosition = function(connector) {
	this.sprite.position.set(connector.sprite.x - 8, connector.sprite.y - 8);
};

File.prototype.moveTo = function(connector) {
	this.moving = true;
	this.target = connector;
};

File.prototype.update = function() {
	if(this.moving && this.target) {
		targetX = (this.target.sprite.x - 8) - this.sprite.x;
		targetY = (this.target.sprite.y - 8) - this.sprite.y;

		pathLength = Math.sqrt(targetX * targetX + targetY * targetY);

		if(pathLength < 3){
			this.connection.endTransfer(this);

			return;
		}

		targetX = targetX / pathLength;
		targetY = targetY / pathLength;

		this.sprite.x += targetX * fileSpeed;
		this.sprite.y += targetY * fileSpeed;
	}
};

function Connector(tile, type, side) {
	this.tile = tile;
	this.side = side;
	this.type = type;
	this.connection = null;

	this.sprite = new Sprite(textures["assets/images/connector" + type + ".png"]);
	this.updatePosition();

	var self = this;

	connectors.push(this);

	window.addEventListener("mousedown", function(event) {
		if(event.button == 0) {
			var x = getClickX(event);
			var y = getClickY(event);

			x -= mapScene.position.x;
			y -= mapScene.position.y;

			if(isInside(self.sprite.x, self.sprite.y,
					self.sprite.width, self.sprite.height, x, y)) {

				event.preventDefault();
				event.stopPropagation();

				if(!self.connection) {
					self.createConnection();
				}
			}
		} else if(event.button == 2) {
			var x = getClickX(event);
			var y = getClickY(event);

			x -= mapScene.position.x;
			y -= mapScene.position.y;

			if(isInside(self.sprite.x, self.sprite.y,
					self.sprite.width, self.sprite.height, x, y)) {

				event.preventDefault();
				event.stopPropagation();
				self.deleteConnection();
			}
		}
	}, false);
}

Connector.prototype.updatePosition = function() {
	var x = this.tile.x * 64;
	var y = this.tile.y * 64;

	if(this.side == Side.UP) {
		this.sprite.position.set(x + 24, y);
	} else if(this.side == Side.RIGHT) {
		this.sprite.position.set(x + 48, y + 24);
	} else if(this.side == Side.DOWN) {
		this.sprite.position.set(x + 24, y + 48);
	} else if(this.side == Side.LEFT) {
		this.sprite.position.set(x, y + 24);
	} else if(this.side == Side.CENTER) {
		this.sprite.position.set(x + 24, y + 25);
	}
};

Connector.prototype.createConnection = function() {
	if(!this.connection) {
		this.connection = new Connection(this);
	}
};

Connector.prototype.deleteConnection = function() {
	if(this.connection) {
		this.connection.delete();
	}
};

Connector.prototype.transferFile = function(file) {
	if(!this.connection || !this.connection.firstConnector || !this.connection.secondConnector) {
		filesLost++;

		return;
	}

	if(this == this.connection.firstConnector) {
		this.connection.transferFile(file, this, this.connection.secondConnector);
	} else {
		this.connection.transferFile(file, this, this.connection.firstConnector);
	}
};

Connector.prototype.onRecive = function(file) {

};

function Connection(firstConnector, secondConnector) {
	this.firstConnector = firstConnector;
	this.secondConnector = secondConnector;
	this.sprite = new Graphics();
	this.mouseUp = false;
	this.files = [];

	if(!secondConnector) {
		this.connected = false;
	} else {
		this.connected = true;
	}

	mapScene.addChild(this.sprite);
	connections.push(this);

	var self = this;

	window.addEventListener("mouseup", function(event) {
		if(self.connected) {
			return;
		}

		if(event.button == 0) {
			var con = null;

			connectors.forEach(function(connector){
				if(isInside(connector.sprite.x, connector.sprite.y,
						connector.sprite.width, connector.sprite.height,
						getClickX(event) - mapScene.x, getClickY(event) - mapScene.y)) {

					con = connector;
				}
			});

			if(con != null) {
				if(con == self.firstConnector) {
					self.delete(con);
					return;
				}

				if(con.type === self.firstConnector.type) {
				 	self.delete(con);
					return;
				}

				if(con.tile != self.firstConnector.tile) {
					if(con.connection) {
						con.deleteConnection();
					}

					con.connection = self;
					self.connected = true;
					self.secondConnector = con;

					self.redraw();
				} else {
					self.delete();
				}

				this.mouseUp = true;

				event.stopPropagation();
			} else {
				self.delete();
			}
		}
	}, false);

	window.addEventListener("mousemove", function(event) {
		if(!self.connected) {
			self.redraw();
		}
	}, false);
}

Connection.prototype.delete = function(secondConnctor) {
	this.files.forEach(function(file) {
		file.hide();
		file = null;

		filesLost++;
	});

	mapScene.removeChild(this.sprite);

	var index = connections.indexOf(this);

	if(index > -1) {
		connections.splice(index, 1);
	}

	if(this.firstConnector != null) {
		delete this.firstConnector.connection;
	}

	var second = secondConnctor || this.secondConnector;

	if(second != null) {
		delete second.connection;
	}
};

Connection.prototype.update = function(event) {
	this.files.forEach(function(file) {
		file.update();
	});
};

Connection.prototype.redraw = function() {
	this.sprite.clear();
	this.sprite.lineStyle(4, wireColor);
	this.sprite.moveTo(this.firstConnector.sprite.x + 8,
		this.firstConnector.sprite.y + 8);

	if(this.connected) {
		this.sprite.lineTo(this.secondConnector.sprite.x + 8,
			this.secondConnector.sprite.y + 8);
	} else if(!this.mouseUp) {
		this.sprite.lineTo(getClickX(event) - mapScene.x, getClickY(event) - mapScene.y);
	} else {
		this.delete();
	}

	this.sprite.endFill();
};

Connection.prototype.transferFile = function(file, from, to) {
	this.files.push(file);

	file.connection = this;
	file.setPosition(from);
	file.moveTo(to);

	file.show();
};

Connection.prototype.endTransfer = function(file) {
	var index = this.files.indexOf(file);

	if(index > -1) {
		this.files.splice(index, 1);
	}

	var target = file.target;

	file.hide();
	file.connection = null;
	file.moving = false;
	file.target = null;

	target.onRecive(file);
};

var Side = {
	UP : 0,
	RIGHT : 1,
	DOWN : 2,
	LEFT : 3,
	CENTER : 4
};

function TileInfoPanel() {
	this.wrapper = document.getElementById("tileInfoWrapper");
	this.info = document.getElementById("tileInfo");
	this.cpuUsage = document.getElementById("cpuUsage");
	this.memoryUsage = document.getElementById("memoryUsage");
	this.tileName = document.getElementById("tileName");
	this.closeButton = document.getElementById("tileInfoClose");
	this.upgradeContainer = document.getElementById("upgrade");
	this.upgradeButton = document.getElementById("upgradeTile");
	this.upgradeCost = document.getElementById("upgradeCost");
	this.deleteButton = document.getElementById("deleteTile");

	this.hidden = true;
	this.tile = null;

	var self = this;

	this.upgradeButton.addEventListener("click", function() {
		self.tile.upgrade();
		self.applyProperties();

		event.preventDefault();
		event.stopPropagation();
	}, false);

	this.closeButton.addEventListener("click", function() {
		self.hide();
	}, false);

	this.deleteButton.addEventListener("click", function() {
		map.setTileById(0, self.tile.x, self.tile.y);
		self.hide();
	}, false);

	window.addEventListener("dblclick", function(event) {
		if(isInside(mapScene.x, mapScene.y,
				 mapScene.width, mapScene.height,
				 getClickX(event), getClickY(event))) {

			 var tile = map.getTile(Math.floor((getClickX(event) - mapScene.x) / 64),
				 Math.floor((getClickY(event) - mapScene.y) / 64));

			 if(tile instanceof Machine) {
				 self.show(tile);
			 } else {
				 self.hide();
			 }
		}
	}, false);
}

function toTitleCase(str) { // http://stackoverflow.com/a/4878800/4741065
	return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}

TileInfoPanel.prototype.show = function(tile) {
	this.hidden = false;
	this.tile = tile;

	console.log(this.tile.level, this.tile.upgrades.length);

	this.applyProperties();
};

TileInfoPanel.prototype.applyProperties = function() {
	if(this.tile.level > this.tile.upgrades.length) {
		this.upgradeContainer.style.display = "none";
	} else {
		this.upgradeContainer.style.display = "block";
		this.upgradeCost.innerHTML = this.tile.upgrades[this.tile.level - 1].cost + "$";
	}

	this.tileName.innerHTML = toTitleCase(this.tile.name) + " lv. " + this.tile.level;
	this.cpuUsage.value = this.tile.cpu;
	this.cpuUsage.max = this.tile.maxCpu;
	this.cpuUsage.high = this.tile.maxCpu / 5 * 4;
	this.memoryUsage.value = this.tile.memory;
	this.memoryUsage.max = this.tile.maxMemory;
	this.cpuUsage.high = this.tile.maxMemory / 5 * 4;

	this.wrapper.style.display = "block";
	this.wrapper.style.left = this.tile.sprite.x - 75 + 27 + mapScene.x + "px";
	this.wrapper.style.top = this.tile.sprite.y - this.info.offsetHeight + 10 + mapScene.y + "px";
};

TileInfoPanel.prototype.hide = function() {
	this.hidden = true;
	this.tile = null;
	this.wrapper.style.display = "none";
};

TileInfoPanel.prototype.update = function() {
	if(!this.hidden) {
		this.cpuUsage.value = this.tile.cpu;
		this.cpuUsage.max = this.tile.maxCpu;
		this.memoryUsage.value = this.tile.memory;
		this.memoryUsage.max = this.tile.maxMemory;
	}
};

function Tile(id, map) {
	this.id = id;
	this.map = map;
	this.sprite = new Sprite(textures["assets/images/tile" + id + ".png"]);
	this.name = "tile";
	this.connectors = [];
	this.type = TileType.NONE;
	this.x = 0;
	this.y = 0;

	mapScene.addChild(this.sprite);
}

Tile.prototype.addConnector = function(type, side, callback) {
	var connector = new Connector(this, type, side);
	connector.onRecive = callback || function(file) {};
	this.connectors[side] = connector;

	mapScene.addChild(connector.sprite);
};

Tile.prototype.setPosition = function(x, y) {
	this.x = x / 64;
	this.y = y / 64;
	this.sprite.position.set(x, y);

	this.connectors.forEach(function(connector) {
		connector.updatePosition();
	});
};

Tile.prototype.update = function() {

};

function Upgrade(cost, upgrade) {
	this.cost = cost;
	this.upgrade = upgrade;
}

Upgrade.prototype.apply = function(machine) {
	this.upgrade(machine);
};

function Machine(id, map) {
	Tile.call(this, id, map);

	this.name = "machine";
	this.type = TileType.MACHINE;
	this.maxCpu = 100;
	this.maxMemory = 100;
	this.cpu = 0;
	this.memory = 0;
	this.dead = false;
	this.files = [];
	this.delay = 0;
	this.maxDelay = 30;
	this.level = 1;
	this.upgrades = [];
}

extend(Tile, Machine);

Machine.prototype.upgrade = function() {
	if(this.level > this.upgrades.length) {
		return false;
	}

	var upgrade = this.upgrades[this.level - 1];

	if(upgrade.cost > money) {
		return false;
	}

	this.level++;
	money -= upgrade.cost;
	upgrade.apply(this);
};

Machine.prototype.addUpgrade = function(cost, upgrade) {
	this.upgrades.push(new Upgrade(cost, upgrade));
};

Machine.prototype.update = function() {
	if(this.dead) {
		this.sprite.alpha = 0.5;

		return;
	}

	this.memory = this.files.length * 5;

	if(this.cpu >= this.maxCpu || this.memory >= this.maxMemory) {
		this.dead = true;
	}
};

Machine.prototype.onRecive = function(file) {
	this.files.push(file);
	this.cpu += file.size * 5;
};

Machine.prototype.onEnd = function(file) {
	this.cpu -= file.size * 5;

	file.hide();

	var index = this.files.indexOf(file);

	if(index > -1) {
		this.files.splice(index, 1);
	}
};

function Server(map) {
	Machine.call(this, 2, map);

	this.name = "server";
	this.type = TileType.SERVER;
	this.maxDelay = 120;
	this.infected = false;
	this.hacked = false;

	var self = this;

	this.addUpgrade(500, function(machine) {
		machine.maxDelay -= 20;
		machine.maxCpu += 20;
		machine.maxMemory += 20;
	});

	this.addUpgrade(300, function(machine) {
		machine.maxDelay -= 20;
		machine.maxCpu += 20;
		machine.maxMemory += 20;
	});

	this.addUpgrade(400, function(machine) {
		machine.maxDelay -= 20;
		machine.maxCpu += 20;
		machine.maxMemory += 20;
	});

	this.addConnector(ConnectorType.IN, Side.UP, function(file) {
		self.onRecive(file);

		if(file.type == FileType.SQL_SCRIPT){
			self.dead = true;
			self.hacked = true;
		} else if(file.type == FileType.VIRUS) {
			self.dead = true;
			self.infected = true;
		}
	});
}

extend(Machine, Server);

Server.prototype.update = function() {
	Machine.prototype.update.call(this);

	if(this.dead) {
		return;
	}

	if(this.delay <= 0) {
		if(this.files.length > 0) {
			var file = this.files.shift();
			this.onEnd(file);

			money += 10;
			filesPassed++;

			file = null;
		}

		this.delay = this.maxDelay;
	} else {
		this.delay--;
	}
};

function EthernetConnector(map) {
	Machine.call(this, 4, map);

	this.name = "ethernet connector";
	this.connactable = true;
	this.type = TileType.ETHERNET_CONNECTOR;
	this.addConnector(ConnectorType.OUT, Side.DOWN);
	this.delay = 0;
	this.maxDelay = 60;
	this.totalFilesPerWave = 0;
	this.lastWave = wave;
}

extend(Machine, EthernetConnector);

EthernetConnector.prototype.update = function() {
	Machine.prototype.update.call(this);

	if(this.lastWave != wave) {
		this.totalFilesPerWave = 0;
	}

	this.lastWave = wave;

	if(this.dead) {
		return;
	}

	if(this.totalFilesPerWave >= 20 + 10 * wave) {
		filesStoped = true;

		return;
	}

	if(this.delay <= 0) {
		var file = this.randomFile();

		if(this.connectors[Side.DOWN].connection) {
			this.connectors[Side.DOWN].transferFile(file);
		}

		this.totalFilesPerWave++;
		this.maxDelay = 65 - wave * 5;
		this.delay = this.maxDelay;
	} else {
		this.delay--;
	}
};

EthernetConnector.prototype.randomFile = function() {
	if(Math.random() < 0.2) {
		return new File(FileType.VIRUS);
	} else if(wave > 2 && Math.random() < 0.2) {
		return new File(FileType.SQL_SCRIPT);
	} else {
		return new File(FileType.NORMAL);
	}
};

function Scanner(map) {
	Machine.call(this, 5, map);

	this.name = "scanner";
	this.type = TileType.SCANNER;
	this.delay = 0;
	this.maxDelay = 30;

	var self = this;

	this.addUpgrade(150, function(machine) {
		machine.maxDelay -= 5;
		machine.maxCpu += 20;
		machine.maxMemory += 20;
	});

	this.addUpgrade(100, function(machine) {
		machine.maxDelay -= 5;
		machine.maxCpu += 20;
		machine.maxMemory += 20;
	});

	this.addUpgrade(150, function(machine) {
		machine.maxDelay -= 5;
		machine.maxCpu += 20;
		machine.maxMemory += 20;
	});


	this.addConnector(ConnectorType.OUT, Side.DOWN);

	this.addConnector(ConnectorType.IN, Side.UP, function(file) {
		file.scan();
		self.onRecive(file);
	});
}

extend(Machine, Scanner);

Scanner.prototype.update = function() {
	Machine.prototype.update.call(this);

	if(this.dead) {
		gameOver = true;

		return;
	}

	if(this.delay <= 0) {
		if(this.files.length > 0) {
			var file = this.files.shift();
			this.onEnd(file);

			this.connectors[Side.DOWN].transferFile(file);
		}

		this.delay = this.maxDelay;
	} else {
		this.delay--;
	}
};

function LineConnector(map) {
	Machine.call(this, 6, map);

	this.name = "line connector";
	this.type = TileType.LINE_CONNECTOR;
	this.delay = 0;
	this.maxDelay = 20;

	var self = this;

	this.addUpgrade(50, function(machine) {
		machine.maxDelay -= 5;
		machine.maxCpu += 20;
		machine.maxMemory += 20;
	});

	this.addUpgrade(70, function(machine) {
		machine.maxDelay -= 5;
		machine.maxCpu += 20;
		machine.maxMemory += 20;
	});

	this.addUpgrade(50, function(machine) {
		machine.maxDelay -= 5;
		machine.maxCpu += 20;
		machine.maxMemory += 20;
	});

	this.addConnector(ConnectorType.IN, Side.UP, function(file) {
		self.onRecive(file);
	});

	this.addConnector(ConnectorType.IN, Side.RIGHT, function(file) {
		self.onRecive(file);
	});

	this.addConnector(ConnectorType.IN, Side.LEFT, function(file) {
		self.onRecive(file);
	});

	this.addConnector(ConnectorType.OUT, Side.DOWN);
}

extend(Machine, LineConnector);

LineConnector.prototype.update = function() {
	Machine.prototype.update.call(this);

	if(this.dead) {
		return;
	}

	if(this.delay <= 0) {
		if(this.files.length > 0) {
			var file = this.files.shift();
			this.onEnd(file);

			this.connectors[Side.DOWN].transferFile(file);
		}

		this.delay = this.maxDelay;
	} else {
		this.delay--;
	}
};

function Antivirus(map) {
	Machine.call(this, 7, map);

	this.name = "antivirus";
	this.type = TileType.ANTIVIRUS;
	this.delay = 0;
	this.maxDelay = 30;
	this.stopSql = false;

	this.addUpgrade(100, function(machine) {
		machine.stopSql = true;
		machine.maxCpu += 10;
		machine.maxMemory += 10;
	});

	this.addUpgrade(50, function(machine) {
		machine.maxDelay -= 5;
		machine.maxCpu += 20;
		machine.maxMemory += 20;
	});

	this.addUpgrade(70, function(machine) {
		machine.maxDelay -= 5;
		machine.maxCpu += 20;
		machine.maxMemory += 20;
	});

	var self = this;

	this.addConnector(ConnectorType.OUT, Side.DOWN);

	this.addConnector(ConnectorType.OUT, Side.LEFT);

	this.addConnector(ConnectorType.IN, Side.UP, function(file) {
		if(file.known && file.type == FileType.VIRUS) {
			self.connectors[Side.LEFT].transferFile(file);
		} else if(file.known && self.stopSql && file.type == FileType.SQL_SCRIPT) {
			self.connectors[Side.LEFT].transferFile(file);
		} else {
			self.onRecive(file);
		}
	});
}

extend(Machine, Antivirus);

Antivirus.prototype.update = function() {
	Machine.prototype.update.call(this);

	if(this.dead) {
		return;
	}

	if(this.delay <= 0) {
		if(this.files.length > 0) {
			var file = this.files.shift();
			this.onEnd(file);

			this.connectors[Side.DOWN].transferFile(file);
		}

		this.delay = this.maxDelay;
	} else {
		this.delay--;
	}
};

function Trash(map) {
	Machine.call(this, 8, map);

	this.name = "trash";
	this.type = TileType.TRASH;

	this.addConnector(ConnectorType.IN, Side.UP, function(file) {
		file.hide();

		if(file.type == FileType.NORMAL) {
			filesLost++;
		}

		file = null;
	});

	this.addConnector(ConnectorType.IN, Side.RIGHT, function(file) {
		file.hide();

		if(file.type == FileType.NORMAL) {
			filesLost++;
		}

		file = null;
	});

	this.addConnector(ConnectorType.IN, Side.DOWN, function(file) {
		file.hide();

		if(file.type == FileType.NORMAL) {
			filesLost++;
		}

		file = null;
	});

	this.addConnector(ConnectorType.IN, Side.LEFT, function(file) {
		file.hide();

		if(file.type == FileType.NORMAL) {
			filesLost++;
		}

		file = null;
	});
}

extend(Machine, Trash);

function DoubleHandSwitch(map) {
	Machine.call(this, 9, map);

	this.name = "double switch";
	this.type = TileType.SWITCH;
	this.currentConnector = Side.LEFT;

	this.applyTexture();

	this.addUpgrade(70, function(machine) {
		machine.maxDelay -= 5;
		machine.maxCpu += 5;
		machine.maxMemory += 5;
	});

	this.addUpgrade(80, function(machine) {
		machine.maxDelay -= 5;
		machine.maxCpu += 5;
		machine.maxMemory += 5;
	});

	this.addUpgrade(90, function(machine) {
		machine.maxDelay -= 5;
		machine.maxCpu += 5;
		machine.maxMemory += 5;
	});

	var self = this;

	this.addConnector(ConnectorType.IN, Side.UP, function(file) {
		self.onRecive(file);
	});

	this.addConnector(ConnectorType.OUT, Side.RIGHT);
	this.addConnector(ConnectorType.OUT, Side.LEFT);

	window.addEventListener("click", function() {
		var x = getClickX(event);
		var y = getClickY(event);

		x -= mapScene.position.x;
		y -= mapScene.position.y;

		if(isInside(self.sprite.x, self.sprite.y,
				self.sprite.width, self.sprite.height, x, y)) {

			if(self.currentConnector == Side.RIGHT) {
				self.currentConnector = Side.LEFT
			} else {
				self.currentConnector = Side.RIGHT;
			}

			self.applyTexture();
		}
	}, false);
}

extend(Machine, DoubleHandSwitch);

DoubleHandSwitch.prototype.update = function() {
	Machine.prototype.update.call(this);

	if(this.dead) {
		return;
	}

	if(this.delay <= 0) {
		if(this.files.length > 0) {
			var file = this.files.shift();
			this.onEnd(file);

			this.connectors[this.currentConnector].transferFile(file);
		}

		this.delay = this.maxDelay;
	} else {
		this.delay--;
	}
};

DoubleHandSwitch.prototype.applyTexture = function() {
	if(this.currentConnector == Side.RIGHT) {
		this.sprite.texture = textures["assets/images/tile" + this.id + "second.png"];
	} else {
		this.sprite.texture = textures["assets/images/tile" + this.id + ".png"];
	}
};

function DoubleAutoSwitch(map) {
	Machine.call(this, 10, map);

	this.name = "double switch";
	this.type = TileType.AUTO_SWITCH;
	this.currentConnector = Side.LEFT;

	this.applyTexture();

	this.addUpgrade(90, function(machine) {
		machine.maxDelay -= 5;
		machine.maxCpu += 5;
		machine.maxMemory += 5;
	});

	this.addUpgrade(100, function(machine) {
		machine.maxDelay -= 5;
		machine.maxCpu += 5;
		machine.maxMemory += 5;
	});

	this.addUpgrade(60, function(machine) {
		machine.maxDelay -= 5;
		machine.maxCpu += 5;
		machine.maxMemory += 5;
	});

	var self = this;

	this.addConnector(ConnectorType.IN, Side.UP, function(file) {
		self.onRecive(file);
	});

	this.addConnector(ConnectorType.OUT, Side.RIGHT);
	this.addConnector(ConnectorType.OUT, Side.LEFT);
}

extend(Machine, DoubleAutoSwitch);

DoubleAutoSwitch.prototype.update = function() {
	Machine.prototype.update.call(this);

	if(this.dead) {
		return;
	}

	if(this.delay <= 0) {
		if(this.files.length > 0) {
			this.applyTexture();

			var file = this.files.shift();
			this.onEnd(file);

			this.connectors[this.currentConnector].transferFile(file);

			if(this.currentConnector == Side.RIGHT) {
				this.currentConnector = Side.LEFT
			} else {
				this.currentConnector = Side.RIGHT;
			}
		}

		this.delay = this.maxDelay;
	} else {
		this.delay--;
	}
};

DoubleAutoSwitch.prototype.applyTexture = function() {
	if(this.currentConnector == Side.RIGHT) {
		this.sprite.texture = textures["assets/images/tile" + this.id + "second.png"];
	} else {
		this.sprite.texture = textures["assets/images/tile" + this.id + ".png"];
	}
};

function TripleHandSwitch(map) {
	Machine.call(this, 11, map);

	this.name = "triple switch";
	this.type = TileType.SWITCH;
	this.currentConnector = Side.LEFT;

	this.addUpgrade(110, function(machine) {
		machine.maxDelay -= 5;
		machine.maxCpu += 5;
		machine.maxMemory += 5;
	});

	this.addUpgrade(120, function(machine) {
		machine.maxDelay -= 5;
		machine.maxCpu += 5;
		machine.maxMemory += 5;
	});

	this.addUpgrade(90, function(machine) {
		machine.maxDelay -= 5;
		machine.maxCpu += 5;
		machine.maxMemory += 5;
	});

	this.applyTexture();

	var self = this;

	this.addConnector(ConnectorType.IN, Side.UP, function(file) {
		self.onRecive(file);
	});

	this.addConnector(ConnectorType.OUT, Side.RIGHT);
	this.addConnector(ConnectorType.OUT, Side.DOWN);
	this.addConnector(ConnectorType.OUT, Side.LEFT);

	window.addEventListener("click", function() {
		var x = getClickX(event);
		var y = getClickY(event);

		x -= mapScene.position.x;
		y -= mapScene.position.y;

		if(isInside(self.sprite.x, self.sprite.y,
				self.sprite.width, self.sprite.height, x, y)) {

			if(self.currentConnector == Side.RIGHT) {
				self.currentConnector = Side.DOWN
			} else if(self.currentConnector == Side.DOWN){
				self.currentConnector = Side.LEFT;
			} else {
				self.currentConnector = Side.RIGHT;
			}

			self.applyTexture();
		}
	}, false);
}

extend(Machine, TripleHandSwitch);

TripleHandSwitch.prototype.update = function() {
	Machine.prototype.update.call(this);

	if(this.dead) {
		return;
	}

	if(this.delay <= 0) {
		if(this.files.length > 0) {
			var file = this.files.shift();
			this.onEnd(file);

			this.connectors[this.currentConnector].transferFile(file);
		}

		this.delay = this.maxDelay;
	} else {
		this.delay--;
	}
};

TripleHandSwitch.prototype.applyTexture = function() {
	if(this.currentConnector == Side.RIGHT) {
		this.sprite.texture = textures["assets/images/tile" + this.id + "second.png"];
	} else if(this.currentConnector == Side.DOWN) {
		this.sprite.texture = textures["assets/images/tile" + this.id + "third.png"];
	} else {
		this.sprite.texture = textures["assets/images/tile" + this.id + ".png"];
	}
};

function TripleAutoSwitch(map) {
	Machine.call(this, 12, map);

	this.name = "double switch";
	this.type = TileType.AUTO_SWITCH;
	this.currentConnector = Side.LEFT;

	this.applyTexture();

	this.addUpgrade(120, function(machine) {
		machine.maxDelay -= 5;
		machine.maxCpu += 5;
		machine.maxMemory += 5;
	});

	this.addUpgrade(40, function(machine) {
		machine.maxDelay -= 5;
		machine.maxCpu += 5;
		machine.maxMemory += 5;
	});

	this.addUpgrade(190, function(machine) {
		machine.maxDelay -= 5;
		machine.maxCpu += 5;
		machine.maxMemory += 5;
	});

	var self = this;

	this.addConnector(ConnectorType.IN, Side.UP, function(file) {
		self.onRecive(file);
	});

	this.addConnector(ConnectorType.OUT, Side.RIGHT);
	this.addConnector(ConnectorType.OUT, Side.DOWN);
	this.addConnector(ConnectorType.OUT, Side.LEFT);
}

extend(Machine, TripleAutoSwitch);

TripleAutoSwitch.prototype.update = function() {
	Machine.prototype.update.call(this);

	if(this.dead) {
		return;
	}

	if(this.delay <= 0) {
		if(this.files.length > 0) {
			this.applyTexture();

			var file = this.files.shift();
			this.onEnd(file);

			this.connectors[this.currentConnector].transferFile(file);

			if(this.currentConnector == Side.RIGHT) {
				this.currentConnector = Side.DOWN
			} else if(this.currentConnector == Side.DOWN){
				this.currentConnector = Side.LEFT;
			} else {
				this.currentConnector = Side.RIGHT;
			}
		}

		this.delay = this.maxDelay;
	} else {
		this.delay--;
	}
};

TripleAutoSwitch.prototype.applyTexture = function() {
	if(this.currentConnector == Side.RIGHT) {
		this.sprite.texture = textures["assets/images/tile" + this.id + "second.png"];
	} else if(this.currentConnector == Side.DOWN) {
		this.sprite.texture = textures["assets/images/tile" + this.id + "third.png"];
	} else {
		this.sprite.texture = textures["assets/images/tile" + this.id + ".png"];
	}
};

function Delayer() {
	Machine.call(this, 13, map);

	this.name = "delayer";
	this.type = TileType.DELAYER;
	this.maxDelay = 90;

	this.addUpgrade(120, function(machine) {
		machine.maxDelay += 30;
		machine.maxCpu += 5;
		machine.maxMemory += 5;
	});

	this.addUpgrade(40, function(machine) {
		machine.maxDelay += 30;
		machine.maxCpu += 5;
		machine.maxMemory += 5;
	});

	this.addUpgrade(190, function(machine) {
		machine.maxDelay += 30;
		machine.maxCpu += 5;
		machine.maxMemory += 5;
	});

	var self = this;

	this.addConnector(ConnectorType.IN, Side.UP, function(file) {
		self.onRecive(file);
	});

	this.addConnector(ConnectorType.OUT, Side.DOWN);
}

extend(Machine, Delayer);

Delayer.prototype.update = function() {
	Machine.prototype.update.call(this);

	if(this.dead) {
		return;
	}

	if(this.delay <= 0) {
		if(this.files.length > 0) {
			var file = this.files.shift();
			this.onEnd(file);

			this.connectors[Side.DOWN].transferFile(file);
		}

		this.delay = this.maxDelay;
	} else {
		this.delay--;
	}
};

function Map(width, height, scene) {
	this.scene = scene;

	mapScene = scene;

	this.terrain = new Array(width);
	this.width = width;
	this.height = height;
	this.servers = [];

	for(var x = 0; x < this.width; x++) {
		this.terrain[x] = new Array(this.width);

		for(var y = 0; y < this.height; y++) {
			this.setTileById(0, x, y);
		}
	}

	this.addEthernetConnector(5, 1);
	this.addServer(5, 7);

	var self = this;
}

Map.prototype.getTile = function(x, y) {
	return this.terrain[x][y];
};

Map.prototype.addServer = function(x, y) {
	this.setTile(new Server(this), x, y);
};

Map.prototype.addEthernetConnector = function(x, y) {
	this.setTile(new EthernetConnector(this), x, y);
};

Map.prototype.setTileById = function(id, x, y) {
	var tile = new Tile(id, this);

	tile.setPosition(x * 64, y * 64);
	this.terrain[x][y] = tile;
};

Map.prototype.setTile = function(tile, x, y) {
	if(tile instanceof Server) {
		this.servers.push(tile);
	}

	tile.setPosition(x * 64, y * 64);
	this.terrain[x][y] = tile;
};

Map.prototype.update = function() {
	if(!gameStarted) {
		return;
	}

	for(var x = 0; x < this.width; x++) {
		for(var y = 0; y < this.height; y++) {
			this.terrain[x][y].update();
		}
	}

	connections.forEach(function(connection) {
		connection.update();
	});

	tileInfoPanel.update();

	var oneOrMoreServersAreUp = false;

	this.servers.forEach(function(server) {
		if(!server.dead) {
			oneOrMoreServersAreUp = true;
		}
	});

	if(!oneOrMoreServersAreUp) {
		gameOver = true;
	}
};