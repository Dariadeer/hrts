import Cell from "../../logic/Cell.js";
import Entity from "../../logic/Entity.js";
import GameObject from "../../logic/GameObject.js";
import Hexagon from "../../utils/Hexagon.js";
import CameraContext from "../CameraContext.js";
import EntityView from "./EntityView.js";
import GameObjectView from "./GameObjectView.js";
import View from "./View.js";

class CellView extends Hexagon implements View {

    static PADDING = 0.1;
    public cell: Cell;
    public gameObjectView: GameObjectView | undefined;
    
    constructor(cell: Cell, radius: number) {
        super(cell.pos.toHex(radius), radius * (1 - CellView.PADDING));

        this.cell = cell;
        this.trackCellContent();
    }

    private trackCellContent(): void {
        this.cell.onContentSet = this.setContent.bind(this);
    }

    public setContent(gameObject: GameObject) {
        console.log('New object set:', gameObject);
        if(gameObject instanceof Entity) this.gameObjectView = new EntityView(gameObject, this);
    }

    public display(cameraContext: CameraContext): void {
        cameraContext.beginPath();
        cameraContext.moveTo(this.verteces[5]);
        for(let v of this.verteces) {
            cameraContext.lineTo(v);
        }

        cameraContext.setColor(0x999999);

        cameraContext.fill();

        cameraContext.debugText(this.cell.pos.toString(), this.pos);

        if(this.gameObjectView) {
            this.gameObjectView.display(cameraContext);
        }
    }
}

export default CellView;