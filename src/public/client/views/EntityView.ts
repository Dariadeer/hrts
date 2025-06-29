import Entity from "../../logic/Entity.js";
import Vector from "../../utils/Vector.js";
import CameraContext from "../camera/CameraContext.js";
import CellView from "./CellView.js";
import GameObjectView from "./GameObjectView.js";
import View from "./View.js";

class EntityView extends GameObjectView implements View {

    public static DEFAULT_SIZE = 40;
    public static DEFAULT_SIZE_VECTOR = new Vector(this.DEFAULT_SIZE, this.DEFAULT_SIZE);
    public static DEFAULT_HALF_SIZE_VECTOR = new Vector(this.DEFAULT_SIZE / 2, this.DEFAULT_SIZE / 2);

    constructor(entity: Entity, cellView: CellView) {
        super(entity, cellView);
    }

    display(cameraContext: CameraContext): void {
        cameraContext.setColor(0x444444);
        cameraContext.fillRect(this.cellView.pos.sub(EntityView.DEFAULT_HALF_SIZE_VECTOR), EntityView.DEFAULT_SIZE_VECTOR);
    }
}

export default EntityView;