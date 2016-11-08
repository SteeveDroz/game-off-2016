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
	    Main.getClass("Driver");
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
	boolean otherPeople = false;
	boolean everybody = false;
	try {
	    Class<?> somePeopleClass = Main.getClass("SomePeople");
	    Pane somePeoplePane = (Pane) somePeopleClass.newInstance();
	    root.getChildren().add(somePeoplePane);
	    somePeople = true;
	} catch (ClassNotFoundException exception) {
	}
	try {
	    Class<?> otherPeopleClass = Main.getClass("OtherPeople");
	    Pane otherPeoplePane = (Pane) otherPeopleClass.newInstance();
	    root.getChildren().add(otherPeoplePane);
	    otherPeople = true;
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
	if (otherPeople)
	    people += 2;
	if (everybody)
	    people += 4;

	int nextBusStop = 0;
	int distance = 0;

	switch (people) {
	case 1:
	    break;
	case 3:
	    break;
	case 4:
	    break;
	case 5:
	    break;
	case 7:
	    break;
	default:
	}

	Label distanceLabel = new Label("Bus stop number " + nextBusStop + " is " + distance + " km away.");
	root.getChildren().add(distanceLabel);
    }

}
