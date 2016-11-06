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
	AUTO_SWITCH : 10
};

var ConnectorType = {
	IN : 0,
	OUT : 1
};

var FileType = {
	NORMAL : 1,
	VIRUS : 2
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

				if(!this.connection) {
					self.createConnection();
				}

				event.stopPropagation();
			}
		} else if(event.button == 2) {
			var x = getClickX(event);
			var y = getClickY(event);

			x -= mapScene.position.x;
			y -= mapScene.position.y;

			if(isInside(self.sprite.x, self.sprite.y,
					self.sprite.width, self.sprite.height, x, y)) {

				self.deleteConnection();
				event.stopPropagation();
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
	this.connection = new Connection(this);
};

Connector.prototype.deleteConnection = function() {
	this.connection.delete();
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
				if(con.connection) {
					self.delete(con);
					return;
				}

				if(con == self.firstConnector) {
					self.delete(con);
					return;
				}

				if(con.type === self.firstConnector.type) {
				 	self.delete(con);
					return;
				}

				if(con.tile != self.firstConnector.tile) {
					var deltaX = con.tile.x - self.firstConnector.tile.x;
					var deltaY = con.tile.y - self.firstConnector.tile.y;

					// if(deltaX > 2 || deltaX < -2 || deltaY > 2 || deltaY < -2) {
					// 	self.delete();
					// }

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
}

extend(Tile, Machine);

Machine.prototype.update = function() {
	if(this.dead) {
		this.sprite.alpha = 0.5;

		return;
	}

	if(this.cpu >= this.maxCpu || this.memory >= this.maxMemory) {
		this.dead = true;
	}
};

Machine.prototype.onRecive = function(file) {
	this.files.push(file);
	this.cpu += file.size * 2;
};

Machine.prototype.onEnd = function(file) {
	this.cpu -= file.size * 2;

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
	this.maxDelay = 60;

	var self = this;

	this.addConnector(ConnectorType.IN, Side.UP, function(file) {
		self.onRecive(file);

		if(file.type == FileType.VIRUS) {
			this.dead = true;
			gameOver = true;
		}
	});
}

extend(Machine, Server);

Server.prototype.update = function() {
	this.memory = this.files.length * 5;
	Machine.prototype.update();

	if(this.dead) {
		gameOver = true;

		return;
	}

	if(this.delay <= 0) {
		if(this.files.length > 0) {
			var file = this.files.shift();
			this.onEnd(file);

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
}

extend(Machine, EthernetConnector);

EthernetConnector.prototype.update = function() {
	Machine.prototype.update();

	if(this.dead) {
		return;
	}

	if(this.delay <= 0) {
		var file = this.randomFile();

		if(this.connectors[Side.DOWN].connection) {
			this.connectors[Side.DOWN].transferFile(file);
		}

		this.delay = this.maxDelay;
	} else {
		this.delay--;
	}
};

EthernetConnector.prototype.randomFile = function() {
	if(Math.random() < 0.2) {
		return new File(FileType.VIRUS);
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

	this.addConnector(ConnectorType.OUT, Side.DOWN);

	this.addConnector(ConnectorType.IN, Side.UP, function(file) {
		file.scan();
		self.onRecive(file);
	});
}

extend(Machine, Scanner);

Scanner.prototype.update = function() {
	this.memory = this.files.length * 5;
	Machine.prototype.update();

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

function LineConnector(map) {
	Machine.call(this, 6, map);

	this.name = "line connector";
	this.type = TileType.LINE_CONNECTOR;
	this.delay = 0;
	this.maxDelay = 20;

	var self = this;

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
	this.memory = this.files.length * 5;
	Machine.prototype.update();

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

	var self = this;

	this.addConnector(ConnectorType.OUT, Side.DOWN);

	this.addConnector(ConnectorType.OUT, Side.LEFT);

	this.addConnector(ConnectorType.IN, Side.UP, function(file) {
		if(file.known && file.type == FileType.VIRUS) {
			self.connectors[Side.LEFT].transferFile(file);
			return;
		}

		self.onRecive(file);
	});
}

extend(Machine, Antivirus);

Antivirus.prototype.update = function() {
	this.memory = this.files.length * 5;
	Machine.prototype.update();

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

function DoubleSwitch(map) {
	Machine.call(this, 9, map);

	this.name = "double switch";
	this.type = TileType.SWITCH;
	this.currentConnector = Side.RIGHT;

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
		}
	}, false);
}

extend(Machine, DoubleSwitch);

DoubleSwitch.prototype.update = function() {
	this.memory = this.files.length * 5;
	Machine.prototype.update();

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

function Map(width, height, scene) {
	this.scene = scene;

	mapScene = scene;

	this.terrain = new Array(width);
	this.width = width;
	this.height = height;
	this.server = null;

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
	this.server = new Server(this);
	this.setTile(this.server, x, y);
};

Map.prototype.addLineConnector = function(x, y) {
	this.setTile(new LineConnector(this), x, y);
};

Map.prototype.addAntivirus = function(x, y) {
	this.setTile(new Antivirus(this), x, y);
};

Map.prototype.addDoubleSwitch = function(x, y) {
	this.setTile(new DoubleSwitch(this), x, y);
};

Map.prototype.addTrash = function(x, y) {
	this.setTile(new Trash(this), x, y);
};

Map.prototype.addScanner = function(x, y) {
	this.setTile(new Scanner(this), x, y);
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
};