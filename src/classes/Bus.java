package classes;

import com.github.steevedroz.gameoff2016.Main;

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
	    Class<?> driverClass = Main.getClass("Driver");
	    Pane driver = (Pane) driverClass.newInstance();
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
	    Class<?> somePeopleClass = Main.getClass("SomePeople");
	    Pane somePeoplePane = (Pane) somePeopleClass.newInstance();
	    root.getChildren().add(somePeoplePane);
	    somePeople = true;
	} catch (ClassNotFoundException exception) {
	}
	try {
	    Class<?> threePeopleClass = Main.getClass("ThreePeople");
	    Pane threePeoplePane = (Pane) threePeopleClass.newInstance();
	    root.getChildren().add(threePeoplePane);
	    threePeople = true;
	} catch (ClassNotFoundException exception) {
	}
	try {
	    Class<?> everybodyClass = Main.getClass("Everybody");
	    Pane everybodyPane = (Pane) everybodyClass.newInstance();
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
