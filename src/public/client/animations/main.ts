import Camera from "../camera/Camera.js";
import CameraController from "../camera/CameraController.js";
import Scene from "../Scene.js";
import EditorController from "./EditorController.js";

CameraController.IS_ZOOM_LIMITED = false;

const camera = new Camera(new Scene());
const controller = new EditorController(camera);

camera.play();