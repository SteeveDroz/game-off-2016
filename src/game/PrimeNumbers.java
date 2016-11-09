package game;

import java.util.ArrayList;
import java.util.List;

import javafx.geometry.Pos;
import javafx.scene.Node;
import javafx.scene.Scene;
import javafx.scene.control.Label;
import javafx.scene.layout.Background;
import javafx.scene.layout.BackgroundFill;
import javafx.scene.layout.FlowPane;
import javafx.scene.paint.Color;

public class PrimeNumbers extends Scene {
    private static final int MAX = 49;
    private FlowPane root;
    private Label response;

    public PrimeNumbers() {
	super(new FlowPane(), 245, 270);
	root = (FlowPane) getRoot();
	initializeComponents();
    }

    private void initializeComponents() {
	for (int i = 1; i <= MAX; i++) {
	    Label label = new Label("" + i);
	    label.setPrefWidth(35);
	    label.setPrefHeight(35);
	    label.setAlignment(Pos.CENTER);
	    label.setOnMouseEntered(event -> {
		if (label.getStyleClass().contains("selected")) {
		    label.setBackground(new Background(new BackgroundFill(Color.PINK, null, null)));
		} else {
		    label.setBackground(new Background(new BackgroundFill(Color.LIGHTGRAY, null, null)));
		}
	    });
	    label.setOnMouseExited(event -> {
		if (label.getStyleClass().contains("selected")) {
		    label.setBackground(new Background(new BackgroundFill(Color.RED, null, null)));
		} else {
		    label.setBackground(new Background(new BackgroundFill(null, null, null)));
		}
	    });
	    label.setOnMouseClicked(event -> {
		if (label.getStyleClass().contains("selected")) {
		    label.getStyleClass().remove("selected");
		    label.setBackground(new Background(new BackgroundFill(Color.LIGHTGRAY, null, null)));
		} else {
		    label.getStyleClass().add("selected");
		    label.setBackground(new Background(new BackgroundFill(Color.PINK, null, null)));
		}
		evaluate();
	    });
	    root.getChildren().add(label);
	}
	response = new Label("Have you completed the tutorial with three people?");
	response.setVisible(false);
	response.setWrapText(true);
	response.prefWidthProperty().bind(root.widthProperty());
	root.getChildren().add(response);
    }

    private void evaluate() {
	List<Integer> eratosthene = caculateEratosthene(MAX);
	boolean correct = true;
	for (Node node : root.getChildren()) {
	    try {
		Label label = (Label) node;
		boolean selected = label.getStyleClass().contains("selected");
		int value = Integer.parseInt(label.getText());
		boolean inEratosthene = eratosthene.contains(value);
		if (selected ^ inEratosthene) {
		    correct = false;
		    break;
		}
	    } catch (ClassCastException | NumberFormatException exception) {
		continue;
	    }
	}
	response.setVisible(correct);
    }

    private List<Integer> caculateEratosthene(int max) {
	int[] numbers = new int[max + 1];
	List<Integer> primes = new ArrayList<Integer>();
	for (int i = 2; i < numbers.length; i++) {
	    numbers[i] = i;
	}
	for (int n = 2; n < numbers.length; n++) {
	    if (numbers[n] > 0) {
		for (int multiple = 2 * n; multiple < numbers.length; multiple += n) {
		    numbers[multiple] = 0;
		}
		primes.add(n);
	    }
	}
	return primes;
    }
}
