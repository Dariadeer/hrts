import GameObject from "../../logic/GameObject.js";
import CameraContext from "../camera/CameraContext.js";
import CellView from "./CellView.js";
import View from "./View.js";

abstract class GameObjectView implements View {

    public gameObject: GameObject;
    public cellView: CellView;

    constructor(gameObject: GameObject, cellView: CellView) {
        this.gameObject = gameObject;
        this.cellView = cellView;
    }

    public abstract display(cameraContext: CameraContext): void;
}

export default GameObjectView;