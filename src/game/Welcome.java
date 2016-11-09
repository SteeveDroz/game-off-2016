package game;

import javafx.geometry.Insets;
import javafx.scene.Scene;
import javafx.scene.control.Label;
import javafx.scene.layout.FlowPane;
import javafx.scene.text.Font;

public class Welcome extends Scene {
    private FlowPane root;

    public Welcome() {
	super(new FlowPane(), 800, 600);
	root = (FlowPane) getRoot();
	initializeComponents();
    }

    private void initializeComponents() {
	Label title = new Label("Welcome");
	title.setFont(new Font(42));
	root.getChildren().add(title);

	Label[] rules = new Label[6];
	rules[0] = new Label(
		"If you see this message, it means that you want to play this GitHub Game Off 2016 game that has the theme \"Hacking, Modding and Augmenting\".");
	rules[1] = new Label(
		"The goal of this game is to display an OctoCat, wierd eight-legged marine feline that loves rubbing his tentacles against you.");
	rules[2] = new Label("In order to do that, you must move files in a directory. Here is how it works:");
	rules[3] = new Label(
		"1) In the \"Game\" directory are all the classes used for this game. Some are in the \"active\" subdirectory and the others in the \"inactive\" subdirectory.");
	rules[4] = new Label(
		"2) Close the current window, move whatever \".class\" file you want from one subdirectory to the other and run the program again. As only the active classes will be taken into account, you will run a different version of the game each time!");
	rules[5] = new Label(
		"Tutorial: simply move the \"Welcome.class\" file to the \"inactive\" subdirectory to go to the next step.");
	for (Label rule : rules) {
	    rule.prefWidthProperty().bind(root.widthProperty());
	    rule.setWrapText(true);
	    rule.setPadding(new Insets(20, 5, 0, 5));
	    rule.setFont(new Font(16));
	    root.getChildren().add(rule);
	}
    }
}
