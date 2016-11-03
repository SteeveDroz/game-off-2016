var TileType =  {
	NONE : 0,
	MACHINE : 1,
	SERVER : 2,
	WIRE : 3,
	ETHERNET_CONNECTOR : 4
};

var ConnectorType = {
	IN : 0,
	OUT : 1
};

var connectors = [];
var connections = [];

function Connector(tile, type, side) {
	this.tile = tile;
	this.side = side;
	this.connected = false;
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

				if (self.connected) {
					self.modifyConnection();
				} else {
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
				if (self.connection) {
					self.connection.delete();
				}

				self.connected = false;
				self.connection = null;
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
	}
};

Connector.prototype.createConnection = function() {
	this.connection = new Connection(this);
	this.connected = true;
};

Connector.prototype.modifyConnection = function() {
	this.connection.ended = false;

	if(this.connection.firstConnector != this) {
		this.connection.firstConnector = this.connection.secondConnector;
		this.connection.secondConnector = this;
	}
};

function Connection(firstConnector, secondConnector) {
	this.firstConnector = firstConnector;
	this.secondConnector = secondConnector;
	this.sprite = new Sprite(textures["assets/images/connection.png"]);
	this.sprite.position.set(this.firstConnector.sprite.x + 2,
		this.firstConnector.sprite.y + 2);

	if(!secondConnector) {
		this.ended = false;
		this.placed = false;
	} else {
		this.ended = true;
		this.placed = true;
	}

	mapScene.addChild(this.sprite);
	connections.push(this);

	var self = this;

	window.addEventListener("mouseup", function() {
		self.placed = true;
	}, false);

	window.addEventListener("mousemove", function(event) {
		self.update(event);
	}, false);
}

Connection.prototype.delete = function() {
	mapScene.removeChild(this.sprite);

	var index = connections.indexOf(this);
	connections.splice(index);
};

Connection.prototype.update = function(event) {
	if(!this.ended && !this.placed) {
		var targetX = getClickX(event) - this.sprite.x;
		var targetY = getClickY(event) - this.sprite.y;

		// this.sprite.anchor.x = 0.5;
		// this.sprite.anchor.y = 0.5;
		this.sprite.rotation = Math.atan2(targetY, targetX) * (180 / Math.PI) / 2;
		// this.sprite.width = targetX;
	}
}

var Side = {
	UP : 0,
	RIGHT : 1,
	DOWN : 2,
	LEFT : 3
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
	if(!this.connactable) {
		return;
	}

	var connector = new Connector(this, type, side);
	this.connectors[side] = connector;

	mapScene.addChild(connector.sprite)
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

	this.addServer(5, 5);
	this.addEthernetConnector(5, 1);
}

Map.prototype.getTile = function(x, y) {
	return this.terrain[x][y];
};

Map.prototype.addServer = function(x, y) {
	this.setTile(Server(this), x, y);
};

Map.prototype.addEthernetConnector = function(x, y) {
	this.setTile(EthernetConnector(this), x, y);
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