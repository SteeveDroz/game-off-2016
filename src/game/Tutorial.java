package game;

import core.com.github.steevedroz.powercycle.Main;
import javafx.geometry.Insets;
import javafx.scene.Scene;
import javafx.scene.control.Label;
import javafx.scene.layout.FlowPane;
import javafx.scene.text.Font;
import javafx.scene.text.TextAlignment;

public class Tutorial extends Scene {
    private FlowPane root;

    public Tutorial() throws InstantiationException, IllegalAccessException {
	super(new FlowPane(), 800, 600);
	root = (FlowPane) getRoot();
	initializeComponents();
    }

    private void initializeComponents() throws InstantiationException, IllegalAccessException {
	Label title = new Label("Tutorial");
	title.setFont(new Font(42));
	root.getChildren().add(title);

	Label[] rules = new Label[7];
	rules[0] = new Label(
		"If you see this message, it means that you want to play this GitHub Game Off 2016 game that has the theme \"Hacking, Modding and Augmenting\".");
	rules[1] = new Label(
		"The term \"Power Cycle\" means turn off and on again, which is a common computer problem solver. The main action to play this game is to close it, modify something and open it again.");
	rules[2] = new Label(
		"The goal of Power Cycle is to display an OctoCat, wierd eight-legged marine feline that loves rubbing his tentacles against you.");
	rules[3] = new Label("In order to do that, you must move files in a directory. Here is how it works:");
	rules[4] = new Label(
		"1) In the \"game\" directory are all the classes used for this game. There is also an \"unused\" subdirectory that contains some classes (most of them at the beginning of the game).");
	rules[5] = new Label(
		"2) Close the current window, move whatever \".class\" file you want from \"game\" to \"game/unused\" or the other way around and run the program again. The unused classes won't be taken into account at all, you will therefore run a different version of the game each time!");
	rules[6] = new Label(
		"Tutorial: simply move the \"Tutorial.class\" file to the \"unused\" subdirectory to go to the next step. Of course, you will need to close this window and run the game again!");
	for (Label rule : rules) {
	    rule.prefWidthProperty().bind(root.widthProperty());
	    rule.setWrapText(true);
	    rule.setTextAlignment(TextAlignment.JUSTIFY);
	    rule.setPadding(new Insets(20, 5, 0, 5));
	    rule.setFont(new Font(16));
	    root.getChildren().add(rule);
	}
	try {
	    Main.getObject("ThreePeople");
	    Label wrongClass = new Label("I know what you wanted to do, but you are supposed to SOLVE the tutorial.");
	    wrongClass.prefWidthProperty().bind(root.widthProperty());
	    wrongClass.setWrapText(true);
	    wrongClass.setPadding(new Insets(20, 5, 0, 5));
	    wrongClass.setFont(new Font(16));
	    root.getChildren().add(wrongClass);
	} catch (ClassNotFoundException e) {
	}
    }
}
