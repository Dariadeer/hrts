import GameObject from "../../logic/GameObject.js";
import Vector from "../../utils/Vector.js";
import CameraContext from "../CameraContext.js";
import CellView from "./CellView.js";
import EntityView from "./EntityView.js";
import View from "./View.js";

class GameObjectView implements View {

    public gameObject: GameObject;
    public cellView: CellView;

    constructor(gameObject: GameObject, cellView: CellView) {
        this.gameObject = gameObject;
        this.cellView = cellView;
    }

    display(cameraContext: CameraContext): void {}
}

export default GameObjectView;