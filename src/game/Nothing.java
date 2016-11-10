package game;

import core.com.github.steevedroz.powercycle.Main;
import javafx.geometry.Pos;
import javafx.scene.Scene;
import javafx.scene.control.Label;
import javafx.scene.layout.FlowPane;
import javafx.scene.text.Font;
import javafx.scene.text.TextAlignment;

public class Nothing extends Scene {
    private FlowPane root;

    public Nothing() throws InstantiationException, IllegalAccessException {
	super(new FlowPane(), 300, 100);
	this.root = (FlowPane) getRoot();
	initializeComponents();
    }

    private void initializeComponents() throws InstantiationException, IllegalAccessException {
	int numberOfClasses = 0;
	try {
	    Main.getObject("Everybody");
	    numberOfClasses += 1;
	} catch (ClassNotFoundException exception) {
	}
	try {
	    Main.getObject("SomePeople");
	    numberOfClasses += 2;
	} catch (ClassNotFoundException exception) {
	}
	try {
	    Main.getObject("Empty");
	    numberOfClasses += 4;
	} catch (ClassNotFoundException exception) {
	}
	try {
	    Main.getObject("MissingClass");
	    numberOfClasses += 8;
	} catch (ClassNotFoundException exception) {
	}
	Label message = new Label();
	switch (numberOfClasses) {
	case 12:
	    message.setText("[OCTOCAT PICTURE]\nCongratulations!");
	    break;

	case 15:
	    message.setText("Ok, everything is in... but it's a bit too full. Now remove all the useless stuff.");
	    break;

	default:
	    message.setText("You removed too much... or not enough. Or maybe you didn't remove the right things!");
	}
	message.setFont(new Font(20));
	message.setWrapText(true);
	message.setTextAlignment(TextAlignment.CENTER);
	message.prefWidthProperty().bind(root.widthProperty());
	root.getChildren().add(message);
    }
}
