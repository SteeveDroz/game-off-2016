package classes;

import javafx.scene.control.Label;
import javafx.scene.layout.Background;
import javafx.scene.layout.BackgroundFill;
import javafx.scene.layout.Pane;
import javafx.scene.paint.Color;

public class Driver extends Pane {
    public Driver() {
	setPrefWidth(200);
	setPrefHeight(150);
	setBackground(new Background(new BackgroundFill(Color.YELLOW, null, null)));
	getChildren().add(new Label("DRIVER"));
    }
}
