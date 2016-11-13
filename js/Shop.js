function strcmp(a, b) {
	if(a.toString() < b.toString()) return -1;
	if(a.toString() > b.toString()) return 1;

	return 0;
}

function ShopItem(id, className, itemName, cost) {
	this.itemName = itemName;
	this.className = className;
	this.itemId = id;
	this.itemCost = cost;

	var container = document.createElement("div");
	container.setAttribute("id", "shopItem");

	this.html = document.createElement("div");
	this.html.setAttribute("id", "shopItemInner");

	container.appendChild(this.html);

	var image = document.createElement("img");

	image.className = "itemIcon";
	image.setAttribute("id", "shopItem" + String(this.itemId));
	image.setAttribute("src", "assets/images/tile" + this.itemId + ".png");

	var self = this;

	image.addEventListener("dragstart", function(event) {
		if(money < self.itemCost) {
			event.preventDefault();
			event.stopPropagation();

			return;
		}

		event.dataTransfer.setData('Text/html', event.target.id);
	}, false);

	document.body.addEventListener("dragover", function(event) {
		event.preventDefault();
		event.stopPropagation();

		return false;
	}, false);

	document.body.addEventListener("drop", function(event) {
		if(strcmp("shopItem" + String(self.itemId), event.dataTransfer.getData("text/html")) != 0) {
			return;
		}

		event.preventDefault();
		event.stopPropagation();

		var x = Math.floor((getClickX(event) - mapScene.x) / 64);
		var y = Math.floor((getClickY(event) - mapScene.y) / 64);

		var tile = map.getTile(x, y);

		if(tile) {
			if(tile.id == 0) {
				money -= self.itemCost;
				map.setTile(new window[self.className](map), x, y);
			}
		}

		if(self.className == "Server") {
			achievementManager.unlock("morePower");
		} else if(self.className == "Trash") {
			achievementManager.unlock("cleanFreak");
		}

		return false;
	}, false);

	this.html.appendChild(image);

	var description = document.createElement("span");

	description.className = "right";

	var nameLabel = document.createElement("div");
	nameLabel.innerHTML = this.itemName.charAt(0).toUpperCase() + this.itemName.slice(1);
	nameLabel.className = "white";

	var moneyLabel = document.createElement("span");
	moneyLabel.className = "blue right";
	moneyLabel.innerHTML = this.itemCost + "$";

	description.appendChild(nameLabel);
	description.appendChild(moneyLabel);

	this.html.appendChild(description);

	document.getElementById("shop").appendChild(container);
}

function Shop() {
	this.items = [];

	this.setupItems();
}

Shop.prototype.setupItems = function() {
	this.addItem(new ShopItem(5, "Scanner", "Scanner", 150));
	this.addItem(new ShopItem(6, "LineConnector", "Hub", 40));
	this.addItem(new ShopItem(7, "Antivirus", "Antivirus", 170));
	this.addItem(new ShopItem(8, "Trash", "Trash", 30));
	this.addItem(new ShopItem(13, "Delayer", "Delayer", 100));
	this.addItem(new ShopItem(9, "DoubleHandSwitch", "Double hand switch", 30));
	this.addItem(new ShopItem(11, "TripleHandSwitch", "Triple hand switch", 60));
	this.addItem(new ShopItem(10, "DoubleAutoSwitch", "Double auto-switch", 60));
	this.addItem(new ShopItem(12, "TripleAutoSwitch", "Triple auto-switch", 90));
	this.addItem(new ShopItem(2, "Server", "Server", 250));
};

Shop.prototype.addItem = function(item) {
	this.items.push(item);
};