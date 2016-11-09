package game;

import core.com.github.steevedroz.powercycle.Main;
import javafx.scene.Scene;
import javafx.scene.control.Label;
import javafx.scene.layout.FlowPane;
import javafx.scene.layout.Pane;
import javafx.scene.text.Font;

public class Bus extends Scene {
    private FlowPane root;

    public Bus() throws InstantiationException, IllegalAccessException {
	super(new FlowPane());
	root = (FlowPane) getRoot();
	initializeComponents();
    }

    private void initializeComponents() throws InstantiationException, IllegalAccessException {
	try {
	    Pane driver = (Pane) Main.getObject("Driver");
	    root.getChildren().add(driver);
	    putPeopleInTheBus();
	} catch (ClassNotFoundException exception) {
	    Label noDriver = new Label("The bus won't move without the driver.");
	    noDriver.setFont(new Font(24));
	    root.getChildren().add(noDriver);
	    return;
	}
    }

    private void putPeopleInTheBus() throws InstantiationException, IllegalAccessException {
	boolean somePeople = false;
	boolean threePeople = false;
	boolean everybody = false;
	try {
	    Pane somePeoplePane = (Pane) Main.getObject("SomePeople");
	    root.getChildren().add(somePeoplePane);
	    somePeople = true;
	} catch (ClassNotFoundException exception) {
	}
	try {
	    Pane threePeoplePane = (Pane) Main.getObject("ThreePeople");
	    root.getChildren().add(threePeoplePane);
	    threePeople = true;
	} catch (ClassNotFoundException exception) {
	}
	try {
	    Pane everybodyPane = (Pane) Main.getObject("Everybody");
	    root.getChildren().add(everybodyPane);
	    everybody = true;
	} catch (ClassNotFoundException exception) {
	}

	int people = 0;
	if (somePeople)
	    people += 1;
	if (threePeople)
	    people += 2;
	if (everybody)
	    people += 4;

	int nextBusStop = 0;
	int distance = 0;

	switch (people) {
	case 1:
	    nextBusStop = 1;
	    distance = 17;
	    break;
	case 3:
	    nextBusStop = 2;
	    distance = 23;
	    break;
	case 4:
	    nextBusStop = 5;
	    distance = 29;
	    break;
	case 5:
	    nextBusStop = 4;
	    distance = 43;
	    break;
	case 7:
	    nextBusStop = 3;
	    distance = 19;
	    break;
	default:
	}

	Label distanceLabel = new Label("Bus stop number " + nextBusStop + " is " + distance + " km away.");
	root.getChildren().add(distanceLabel);
    }

}
