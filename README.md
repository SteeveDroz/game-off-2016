# Server defense

Protect your server from hackers, viruses and other dangerous stuff!
You can play it at https://egordorichev.github.io/Server-Defense/

### Install

Download project, unzip it and put it contents in your server's root. You are ready to play!

### How to play

Basic idea is that you need to filtrate files comming to server, and reveal dangerous files and scripts.
So basicly, you need to connect ethernet connector with server. 
To connect machines together, draw a line between machines connectors. 
Red connector is for ouput and green ones are for input.

![](https://raw.githubusercontent.com/egordorichev/Server-Defense/gh-pages/image2.gif)

When you have connected all machines, press "Start" button.

You will see files traveling along wires, you created:

![](https://raw.githubusercontent.com/egordorichev/Server-Defense/gh-pages/image1.gif)

#### Buying stuff

To buy something in the shop, simply drag that item icon to a free place.

##### Shop items

###### Ethernet connector

![](https://raw.githubusercontent.com/egordorichev/Server-Defense/gh-pages/assets/images/tile4.png)

It has one connector at bottom, it produces one file per second at first wave;
It one of the most important tiles.

###### Server

![](https://raw.githubusercontent.com/egordorichev/Server-Defense/gh-pages/assets/images/tile2.png)

###### Scanner

![](https://raw.githubusercontent.com/egordorichev/Server-Defense/gh-pages/assets/images/tile5.png)

Scans incomming files. 

###### Hub

![](https://raw.githubusercontent.com/egordorichev/Server-Defense/gh-pages/assets/images/tile6.png)

Connects wires together.

###### Antivirus

![](https://raw.githubusercontent.com/egordorichev/Server-Defense/gh-pages/assets/images/tile7.png)

If files was already scanned and it's a virus, it will transfer it to it's left connector. Otherwise, it will go down.
After upgrading to level 2, it also protects line from sql-scripts.

###### Trash

![](https://raw.githubusercontent.com/egordorichev/Server-Defense/gh-pages/assets/images/tile8.png)

Simply deletes all incoming files.

###### Delayer

![](https://raw.githubusercontent.com/egordorichev/Server-Defense/gh-pages/assets/images/tile13.png)

Passes files with small delay.

###### Switches

![](https://raw.githubusercontent.com/egordorichev/Server-Defense/gh-pages/assets/images/tile9.png)
![](https://raw.githubusercontent.com/egordorichev/Server-Defense/gh-pages/assets/images/tile10.png)
![](https://raw.githubusercontent.com/egordorichev/Server-Defense/gh-pages/assets/images/tile11.png)
![](https://raw.githubusercontent.com/egordorichev/Server-Defense/gh-pages/assets/images/tile12.png)

TODO

#### Upgrades and tile info

If you double click on any not emtpy tile, you will see popup, showing tile stats:

![](https://raw.githubusercontent.com/egordorichev/Server-Defense/gh-pages/image3.png)

Here you can upgrade tile, see it's cpu and memory usage and level.

#### Winning

When six wave appears, you win the round! You will recive some more money for the files, that reached your servers.
