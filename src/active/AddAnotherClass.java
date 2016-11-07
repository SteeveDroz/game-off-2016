package active;

import javafx.geometry.Insets;
import javafx.scene.Scene;
import javafx.scene.control.Label;
import javafx.scene.layout.FlowPane;
import javafx.scene.text.Font;

public class AddAnotherClass extends Scene {
    private FlowPane root;

    public AddAnotherClass() {
	super(new FlowPane(), 800, 600);
	root = (FlowPane) getRoot();
	initializeComponents();
    }

    private void initializeComponents() {
	Label title = new Label("Well done");
	title.setFont(new Font(42));
	root.getChildren().add(title);
	Label[] rules = new Label[2];
	rules[0] = new Label("Sometimes, it's not enough to remove what's in the way, you must think otherwise.");
	rules[1] = new Label(
		"Sometimes, you must add something that is missing. Try to find the missing class in \"inactive\" and put it back in \"active\".");
	for (Label rule : rules) {
	    rule.prefWidthProperty().bind(root.widthProperty());
	    rule.setWrapText(true);
	    rule.setPadding(new Insets(20, 5, 0, 5));
	    rule.setFont(new Font(16));
	    root.getChildren().add(rule);
	}

    }
}
