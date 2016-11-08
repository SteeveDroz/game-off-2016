package classes;

import javafx.geometry.Insets;
import javafx.scene.control.Label;
import javafx.scene.text.Font;

public class MyCrew extends Label {
    public MyCrew() {
	super();
	setText("The driver is in the bus, at the first stop, some people get in. At the second stop, other people get in. At the third stop, everybody gets in. At the fourth stop, other people get off. At the fifth stop, some people get out. How long did the drive last?");
	setWrapText(true);
	setPadding(new Insets(20, 5, 0, 5));
	setFont(new Font(18));
    }
}
