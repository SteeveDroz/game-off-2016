package core.com.github.steevedroz.powercycle;

import java.io.File;
import java.io.IOException;
import java.nio.file.FileVisitResult;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.SimpleFileVisitor;
import java.nio.file.StandardCopyOption;
import java.nio.file.attribute.BasicFileAttributes;

import javafx.application.Application;
import javafx.scene.Scene;
import javafx.scene.control.Alert;
import javafx.scene.control.Alert.AlertType;
import javafx.stage.Stage;

public class Main extends Application {
    private static final String VERSION = "v1.0.0-beta";
    private static Stage STAGE;

    private static final String[] ACTIVE_CLASSES = new String[] { "Tutorial", "AddAnotherClass" };
    private static final String[] INACTIVE_CLASSES = new String[] { "NeverUsed", "MissingClass", "MyCrew", "Bus",
	    "Driver", "SomePeople", "ThreePeople", "Everybody", "PrimeNumbers", "Higher", "Lower", "Empty", "Nothing" };

    private static final String[] SCENES = new String[] { "Tutorial", "AddAnotherClass", "Bus", "PrimeNumbers",
	    "Higher", "Nothing" };

    private static final String MAIN_DIRECTORY = "." + File.separator;
    private static final String BACKUP_DIRECTORY = "core" + File.separator + "backup" + File.separator;
    private static final String INACTIVE_FOLDER = "game" + File.separator + "unused" + File.separator;

    public static final String ACTIVE_FOLDER = "game" + File.separator;

    @Override
    public void start(Stage primaryStage) {
	try {
	    Main.STAGE = primaryStage;
	    primaryStage.setTitle("Power Cycle " + VERSION);
	    Scene scene = null;
	    for (String sceneName : SCENES) {
		try {
		    scene = (Scene) getObject(sceneName);
		    break;
		} catch (ClassNotFoundException exception) {
		    continue;
		}
	    }
	    if (scene == null) {
		throw new ClassNotFoundException();
	    }
	    primaryStage.setScene(scene);
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
	if (args.length > 0) {
	    if (args[0].equals("reinit")) {
		Main.reinit();
	    } else if (args[0].equals("backup")) {
		Main.backup();
		System.exit(0);
	    }
	}
	launch(args);
    }

    public static Object getObject(String className)
	    throws ClassNotFoundException, InstantiationException, IllegalAccessException {
	return Class.forName(ACTIVE_FOLDER.replace(File.separatorChar, '.') + className).newInstance();
    }

    public static Stage getStage() {
	return Main.STAGE;
    }

    private static void reinit() {
	new File(MAIN_DIRECTORY + INACTIVE_FOLDER).mkdirs();
	Path backupActive = Paths.get(BACKUP_DIRECTORY, ACTIVE_FOLDER);
	Path backupInactive = Paths.get(BACKUP_DIRECTORY, INACTIVE_FOLDER);
	Path active = Paths.get(MAIN_DIRECTORY, ACTIVE_FOLDER);
	Path inactive = Paths.get(MAIN_DIRECTORY, INACTIVE_FOLDER);
	try {
	    empty(active);
	    empty(inactive);
	    copy(backupActive, active);
	    copy(backupInactive, inactive);
	} catch (IOException e) {
	    e.printStackTrace();
	}
    }

    private static void backup() {
	File active = new File(MAIN_DIRECTORY + ACTIVE_FOLDER);

	String backupActive = BACKUP_DIRECTORY + ACTIVE_FOLDER;
	String backupInactive = BACKUP_DIRECTORY + INACTIVE_FOLDER;

	File[] filesInActive = active.listFiles();
	for (File file : filesInActive) {
	    try {
		tryToMove(file, ACTIVE_CLASSES, backupActive);
		tryToMove(file, INACTIVE_CLASSES, backupInactive);
	    } catch (FinishedMovingException exception) {
		continue;
	    }
	}
    }

    private static void tryToMove(File file, String[] classList, String destination) throws FinishedMovingException {
	for (String className : classList) {
	    if (file.getName().equals(className + ".class")) {
		file.renameTo(new File(destination + file.getName()));
		throw new FinishedMovingException();
	    }
	}
    }

    private static void empty(Path directory) throws IOException {
	Files.walkFileTree(directory, new SimpleFileVisitor<Path>() {
	    @Override
	    public FileVisitResult visitFile(Path file, BasicFileAttributes attrs) throws IOException {
		Files.delete(file);
		return FileVisitResult.CONTINUE;
	    }
	});
    }

    private static void copy(Path from, Path to) throws IOException {
	Files.walkFileTree(from, new SimpleFileVisitor<Path>() {
	    @Override
	    public FileVisitResult visitFile(Path file, BasicFileAttributes attrs) throws IOException {
		Files.copy(file, to.resolve(from.relativize(file)), StandardCopyOption.REPLACE_EXISTING);
		return FileVisitResult.CONTINUE;
	    }
	});
    }
}
