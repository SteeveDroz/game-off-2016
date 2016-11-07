
import javafx.application.Application;
import javafx.scene.Scene;
import javafx.scene.control.Alert;
import javafx.scene.control.Alert.AlertType;
import javafx.stage.Stage;

public class Main extends Application {
    private String[] scenes;

    public Main() {
	scenes = new String[] { "Welcome" };
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
	    alert.setTitle("An error occurred");
	    alert.setHeaderText("An error occurred");
	    alert.setContentText("The game is being reinitialized.\nPlease run again to play.");
	    alert.show();
	    // TODO Reinitialize
	}
    }

    public static void main(String[] args) {
	launch(args);
    }
}
