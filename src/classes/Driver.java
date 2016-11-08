package classes;

import javafx.event.EventHandler;
import javafx.scene.control.Label;
import javafx.scene.control.TextField;
import javafx.scene.input.KeyEvent;
import javafx.scene.layout.HBox;
import javafx.scene.layout.VBox;

public class Driver extends VBox {
    private Label driver;

    public Driver() {
	driver = new Label("Bob");
	TextField distance1 = new TextField();
	TextField distance2 = new TextField();
	TextField distance3 = new TextField();
	TextField distance4 = new TextField();
	TextField distance5 = new TextField();

	EventHandler<KeyEvent> update = new EventHandler<KeyEvent>() {
	    @Override
	    public void handle(KeyEvent event) {
		if (distance1.getText().equals("17") && distance2.getText().equals("23")
			&& distance3.getText().equals("19") && distance4.getText().equals("43")
			&& distance5.getText().equals("29")) {
		    driver.setText("Agent 2-3-5-7-11-13");
		} else {
		    driver.setText("Bob");
		}
	    }
	};

	HBox hBoxDriver = new HBox();
	hBoxDriver.getChildren().add(new Label("Name: "));
	hBoxDriver.getChildren().add(driver);
	getChildren().add(hBoxDriver);

	HBox hBox1 = new HBox();
	distance1.setOnKeyReleased(update);
	hBox1.getChildren().add(new Label("Distance 1:"));
	hBox1.getChildren().add(distance1);
	getChildren().add(hBox1);

	HBox hBox2 = new HBox();
	distance2.setOnKeyReleased(update);
	hBox2.getChildren().add(new Label("Distance 2:"));
	hBox2.getChildren().add(distance2);
	getChildren().add(hBox2);

	HBox hBox3 = new HBox();
	distance3.setOnKeyReleased(update);
	hBox3.getChildren().add(new Label("Distance 3:"));
	hBox3.getChildren().add(distance3);
	getChildren().add(hBox3);

	HBox hBox4 = new HBox();
	distance4.setOnKeyReleased(update);
	hBox4.getChildren().add(new Label("Distance 4:"));
	hBox4.getChildren().add(distance4);
	getChildren().add(hBox4);

	HBox hBox5 = new HBox();
	distance5.setOnKeyReleased(update);
	hBox5.getChildren().add(new Label("Distance 5:"));
	hBox5.getChildren().add(distance5);
	getChildren().add(hBox5);
    }
}
