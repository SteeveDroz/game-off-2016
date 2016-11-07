package classes;

import com.github.steevedroz.gameoff2016.Main;

import javafx.geometry.Insets;
import javafx.scene.Scene;
import javafx.scene.control.Label;
import javafx.scene.layout.FlowPane;
import javafx.scene.text.Font;

public class AddAnotherClass extends Scene {
    private FlowPane root;

    public AddAnotherClass() throws InstantiationException, IllegalAccessException {
	super(new FlowPane(), 800, 600);
	root = (FlowPane) getRoot();
	initializeComponents();
    }

    private void initializeComponents() throws InstantiationException, IllegalAccessException {
	Label title = new Label("Well done");
	title.setFont(new Font(42));
	root.getChildren().add(title);
	Label[] instructions = new Label[2];
	instructions[0] = new Label(
		"Sometimes, it's not enough to remove what's in the way, you must think otherwise.");
	instructions[1] = new Label(
		"Sometimes, you must add something that is missing. Try to find the missing class in \"inactive\" and put it back in \"active\".");
	for (Label instruction : instructions) {
	    instruction.prefWidthProperty().bind(root.widthProperty());
	    instruction.setWrapText(true);
	    instruction.setPadding(new Insets(20, 5, 0, 5));
	    instruction.setFont(new Font(16));
	    root.getChildren().add(instruction);
	}

	try {
	    Class<?> missingClass = Main.getClass("MissingClass");
	    Label missing = (Label) missingClass.newInstance();
	    missing.setText("Finally complete! I feel myself at last. I can now bring the rest of my crew with me.");
	    missing.setWrapText(true);
	    missing.prefWidthProperty().bind(root.widthProperty());
	    missing.setPadding(new Insets(20, 5, 0, 5));
	    missing.setFont(new Font(18));
	    root.getChildren().add(missing);

	} catch (ClassNotFoundException exception) {
	}
    }
}
