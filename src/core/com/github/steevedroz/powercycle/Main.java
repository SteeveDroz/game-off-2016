package core.com.github.steevedroz.powercycle;

import java.io.File;

import javafx.application.Application;
import javafx.scene.Scene;
import javafx.scene.control.Alert;
import javafx.scene.control.Alert.AlertType;
import javafx.stage.Stage;

public class Main extends Application {
    private static final String[] ACTIVE_CLASSES = new String[] { "Welcome", "AddAnotherClass" };
    private static final String[] INACTIVE_CLASSES = new String[] { "NeverUsed", "MissingClass", "MyCrew", "Bus",
	    "Driver", "SomePeople", "ThreePeople", "Everybody", "PrimeNumbers" };

    private static final String[] scenes = new String[] { "Welcome", "AddAnotherClass", "Bus", "PrimeNumbers" };

    private static final String MAIN_DIRECTORY = "." + File.separator;
    private static final String INACTIVE_FOLDER = "game" + File.separator + "unused" + File.separator;

    public static final String ACTIVE_FOLDER = "game" + File.separator;

    @Override
    public void start(Stage primaryStage) {
	try {
	    Scene scene = null;
	    for (String sceneName : scenes) {
		try {
		    Class<?> sceneClass = getClass(sceneName);
		    scene = (Scene) sceneClass.newInstance();
		    break;
		} catch (ClassNotFoundException exception) {
		    continue;
		}
	    }
	    if (scene == null) {
		throw new ClassNotFoundException();
	    }
	    primaryStage.setScene(scene);
	    primaryStage.setTitle("Power Cycle");
	    primaryStage.show();
	} catch (Exception e) {
	    e.printStackTrace();
	    Alert alert = new Alert(AlertType.ERROR);
	    alert.setTitle("Error");
	    alert.setHeaderText("An error occurred");
	    alert.setContentText("The game is being reinitialized.\nPlease run again to play.");
	    alert.showAndWait();
	    reinit();
	}
    }

    public static void main(String[] args) {
	if (args.length > 0 && args[0].equals("reinit")) {
	    Main.reinit();
	}
	launch(args);
    }

    public static Class<?> getClass(String className) throws ClassNotFoundException {
	return Class.forName(ACTIVE_FOLDER.replace(File.separatorChar, '.') + className);
    }

    private static void reinit() {
	for (String activeClass : ACTIVE_CLASSES) {
	    activate(activeClass);
	}
	for (String inactiveClass : INACTIVE_CLASSES) {
	    deactivate(inactiveClass);
	}

    }

    private static void activate(String name) {
	File file = new File(MAIN_DIRECTORY + INACTIVE_FOLDER + name + ".class");
	file.renameTo(new File(MAIN_DIRECTORY + ACTIVE_FOLDER + name + ".class"));
    }

    private static void deactivate(String name) {
	File file = new File(MAIN_DIRECTORY + ACTIVE_FOLDER + name + ".class");
	file.renameTo(new File(MAIN_DIRECTORY + INACTIVE_FOLDER + name + ".class"));
    }
}
