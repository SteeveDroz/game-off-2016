var TileType =  {
	NONE : 0,
	MACHINE : 1,
	SERVER : 2,
	WIRE : 3,
	ETHERNET_CONNECTOR : 4,
	FILTER : 5
};

var ConnectorType = {
	IN : 0,
	OUT : 1,
	WIRE_CONNECTOR : 2
};

var connectors = [];
var connections = [];

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
			}
		} else if(event.button == 2) {
			var x = getClickX(event);
			var y = getClickY(event);

			x -= mapScene.position.x;
			y -= mapScene.position.y;

			if(isInside(self.sprite.x, self.sprite.y,
					self.sprite.width, self.sprite.height, x, y)) {

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
	this.connection = new Connection(this);
};

Connector.prototype.deleteConnection = function() {
	this.connection.delete();
};

function Connection(firstConnector, secondConnector) {
	this.firstConnector = firstConnector;
	this.secondConnector = secondConnector;
	this.sprite = new Graphics();
	this.mouseUp = false;

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
					self.delete();
				}

				if(con == self.firstConnector) {
					self.delete();
				}

				if(con == self.secondConnector) {
					self.delete();
				}

				// if(con.type == self.firstConnector.type) {
				// 	self.delete();
				// }

				if(con.tile != self.firstConnector.tile) {
					var deltaX = con.tile.x - self.firstConnector.tile.x;
					var deltaY = con.tile.y - self.firstConnector.tile.y;

					if(deltaX > 2 || deltaX < -2 || deltaY > 2 || deltaY < -2) {
						self.delete();
					}

					self.connected = true;
					self.secondConnector = con;
					con.connection = self;

					self.redraw();
				} else {
					console.log("can't wire to the same tile");
					self.delete();
				}
			}

			self.mouseUp = true;
		}
	}, false);

	window.addEventListener("mousemove", function(event) {
		self.update(event);
	}, false);
}

Connection.prototype.delete = function() {
	mapScene.removeChild(this.sprite);

	var index = connections.indexOf(this);
	connections.splice(index);

	if(this.firstConnector != null) {
		delete this.firstConnector.connection;
	}

	if(this.secondConnector != null) {
		delete this.secondConnector.connection;
	}
};

Connection.prototype.update = function(event) {
	if(!this.connected) {
		this.redraw();
	}
};

Connection.prototype.redraw = function() {
	this.sprite.clear();
	this.sprite.lineStyle(4, 0x000000);
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
	this.connactable = false;
	this.connectors = [];
	this.type = TileType.NONE;
	this.x = 0;
	this.y = 0;

	mapScene.addChild(this.sprite);
}

Tile.prototype.addConnector = function(type, side) {
	// if(!this.connactable) {
	// 	return;
	// }

	var connector = new Connector(this, type, side);
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
	var tile = new Tile(id, map);

	tile.name = "machine";
	tile.type = TileType.MACHINE;
	tile.connactable = true;
	tile.maxCpu = 100;
	tile.maxMemory = 100;
	tile.cpu = 0;
	tile.memory = 0;
	tile.dead = false;

	return tile;
}

Machine.prototype.update = function() {
	if(this.dead) {
		return;
	}

	if(this.cpu >= this.maxCpu || this.memory >= this.maxMemory) {
		this.dead = true;
	}
};

function Server(map) {
	var machine = new Machine(2, map);

	machine.name = "server"
	machine.type = TileType.SERVER;
	machine.maxCpu = 1000;
	machine.maxMemory = 1000;
	machine.addConnector(ConnectorType.IN, Side.UP);

	return machine;
}

function Wire(map) {
	var tile = new Tile(3, map);

	tile.name = "wire";
	tile.connactable = true;
	tile.type = TileType.WIRE;

	return tile;
}

function EthernetConnector(map) {
	var tile = new Tile(4, map);

	tile.name = "ethernet connector";
	tile.connactable = true;
	tile.type = TileType.ETHERNET_CONNECTOR;
	tile.addConnector(ConnectorType.OUT, Side.DOWN);

	return tile;
}

function Filter(map) {
	var machine = new Machine(5, map);

	machine.name = "filter"
	machine.type = TileType.FILTER;
	machine.maxCpu = 500;
	machine.maxMemory = 500;
	machine.addConnector(ConnectorType.IN, Side.UP);
	machine.addConnector(ConnectorType.OUT, Side.DOWN);

	return machine;
}


function Map(width, height, scene) {
	mapScene = new Container();
	mapScene.position.set(200, 0);

	scene.addChild(mapScene);

	this.scene = mapScene;
	this.terrain = new Array(width);

	for(var x = 0; x < width; x++) {
		this.terrain[x] = new Array(width);

		for(var y = 0; y < height; y++) {
			this.setTileById(0, x, y);
		}
	}

	this.addEthernetConnector(5, 1);
	this.addFilter(5, 3);
	this.addServer(5, 5);
}

Map.prototype.getTile = function(x, y) {
	return this.terrain[x][y];
};

Map.prototype.addServer = function(x, y) {
	this.setTile(new Server(this), x, y);
};

Map.prototype.addFilter = function(x, y) {
	this.setTile(new Filter(this), x, y);
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
	for(var x = 0; x < this.width; x++) {
		for(var y = 0; y < this.height; y++) {
			this.terrain[x][y].update();
		}
	}
};