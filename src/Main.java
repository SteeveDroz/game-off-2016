
import java.io.File;

import javafx.application.Application;
import javafx.scene.Scene;
import javafx.scene.control.Alert;
import javafx.scene.control.Alert.AlertType;
import javafx.stage.Stage;

public class Main extends Application {
    private String[] activeClasses;
    private String[] inactiveClasses;
    private String[] scenes;

    public Main() {
	activeClasses = new String[] { "Welcome" };
	inactiveClasses = new String[] {};
	scenes = new String[] { "Welcome" };
    }

    @Override
    public void start(Stage primaryStage) {
	try {
	    deactivate("Dummy");
	    Scene scene = null;
	    for (String sceneName : scenes) {
		try {
		    Class<?> sceneClass = Class.forName("active." + sceneName);
		    scene = (Scene) sceneClass.newInstance();
		    break;
		} catch (ClassNotFoundException exception) {
		    continue;
		}
	    }
	    scene.getStylesheets().add(getClass().getResource("application.css").toExternalForm());
	    primaryStage.setScene(scene);
	    primaryStage.setTitle("GitHub Game Off 2016 (WORKING TITLE)");
	    primaryStage.show();
	} catch (Exception e) {
	    Alert alert = new Alert(AlertType.ERROR);
	    alert.setTitle("An error occurred");
	    alert.setHeaderText("An error occurred");
	    alert.setContentText("The game is being reinitialized.\nPlease run again to play.");
	    alert.show();
	    for (String activeClass : activeClasses) {
		activate(activeClass);
	    }
	    for (String inactiveClass : inactiveClasses) {
		deactivate(inactiveClass);
	    }
	}
    }

    public static void main(String[] args) {
	launch(args);
    }

    private void activate(String name) {
	File file = new File("./bin/inactive/" + name + ".class");
	file.renameTo(new File("./bin/active/" + name + ".class"));
    }

    private void deactivate(String name) {
	File file = new File("./bin/active/" + name + ".class");
	file.renameTo(new File("./bin/inactive/" + name + ".class"));
    }
}
