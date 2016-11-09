package game;

import javafx.geometry.Insets;
import javafx.scene.control.Label;
import javafx.scene.text.Font;

public class MissingClass extends Label {
    public MissingClass() {
	super();
	setText("Finally complete! I feel myself at last. I can now bring the rest of my crew with me.");
	setWrapText(true);
	setPadding(new Insets(20, 5, 0, 5));
	setFont(new Font(18));

    }
}
