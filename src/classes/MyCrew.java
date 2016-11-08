package classes;

import javafx.geometry.Insets;
import javafx.scene.control.Label;
import javafx.scene.text.Font;

public class MyCrew extends Label {
    public MyCrew() {
	super();
	setText("Bob the bus driver drives his bus. At the first stop, some people get in. At the second stop, three people get in. At the third stop, everybody gets in. At the fourth stop, three people get off. At the fifth stop, some people get out. Apparently, Bob was a secret agent. What was his code name?");
	setWrapText(true);
	setPadding(new Insets(20, 5, 0, 5));
	setFont(new Font(18));
    }
}
