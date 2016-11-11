# Power Cycle

> Have you tried turning it off and on again?

> &mdash; Every IT guy ever

In Power Cycle, your goal is to turn off the game, modify it and turn it back on. The game was programmed with a whole bunch of files and the user has to decide which files they want to use during the next launch. The good combination will lead to the next level. As easy as moving files around!

## The `game` folder

The `game` folder contains all the classes (e. g. program files) required to finish Power Cycle. Some of them are directly there, but most of them are in a subfolder called `unused`. When the game is launched, only the files in `game` are taken into account to decide what will be displayed, the ones in `game/unused` will be deliberately ignored. The displayed informations when the game is lauched should give the player enough hints to help them find the next file configuration.

The goal of the game? Display an OctoCat, of course!

## Requirements

The game works using Java 8 or above, be sure to have the correct JRE installed.

There is no need to install the game, only unzip the archive and open the folder.
