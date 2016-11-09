package game;

import core.com.github.steevedroz.powercycle.Main;
import javafx.scene.Scene;
import javafx.scene.control.Label;
import javafx.scene.layout.FlowPane;
import javafx.scene.text.Font;

public class Higher extends Scene {
    private FlowPane root;

    public Higher() throws InstantiationException, IllegalAccessException {
	super(new FlowPane());
	root = (FlowPane) getRoot();
	initializeComponents();
    }

    private void initializeComponents() throws InstantiationException, IllegalAccessException {
	try {
	    Label lower = (Label) Main.getObject("Lower");
	    root.getChildren().add(lower);
	} catch (ClassNotFoundException e) {
	    Label needOpposite = new Label("You also need its opposite.");
	    needOpposite.setFont(new Font(42));
	    root.getChildren().add(needOpposite);
	}
    }
}
