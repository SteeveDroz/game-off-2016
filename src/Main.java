
import java.io.File;

import javafx.application.Application;
import javafx.scene.Scene;
import javafx.scene.control.Alert;
import javafx.scene.control.Alert.AlertType;
import javafx.stage.Stage;

public class Main extends Application {
    private static final String[] activeClasses = new String[] { "Welcome", "AddAnotherClass" };
    private static final String[] inactiveClasses = new String[] { "MissingClass" };

    private String[] scenes;

    public Main() {
	scenes = new String[] { "Welcome", "AddAnotherClass" };
    }

    @Override
    public void start(Stage primaryStage) {
	try {
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
	    alert.setTitle("Error");
	    alert.setHeaderText("An error occurred");
	    alert.setContentText("The game is being reinitialized.\nPlease run again to play.");
	    alert.show();
	    reinit();
	}
    }

    public static void main(String[] args) {
	if (args.length > 0 && args[0].equals("reinit")) {
	    Main.reinit();
	    System.out.println("Reinitialized");
	}
	launch(args);
    }

    private static void reinit() {
	for (String activeClass : activeClasses) {
	    activate(activeClass);
	}
	for (String inactiveClass : inactiveClasses) {
	    deactivate(inactiveClass);
	}

    }

    private static void activate(String name) {
	File file = new File("./bin/inactive/" + name + ".class");
	file.renameTo(new File("./bin/active/" + name + ".class"));
    }

    private static void deactivate(String name) {
	File file = new File("./bin/active/" + name + ".class");
	file.renameTo(new File("./bin/inactive/" + name + ".class"));
    }
}
