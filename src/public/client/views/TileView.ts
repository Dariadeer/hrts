import Tile from "../../logic/Tile.js";
import Entity from "../../logic/Entity.js";
import GameObject from "../../logic/GameObject.js";
import Hexagon from "../../utils/Hexagon.js";
import Vector from "../../utils/Vector.js";
import CameraContext from "../camera/CameraContext.js";
import EntityView from "./EntityView.js";
import GameObjectView from "./GameObjectView.js";
import View from "./View.js";


class CellView implements View {

    static PADDING = 0.055;
    public globalPos: Vector;
    public cell: Tile;
    public displayHexagon: Hexagon;
    public outlineHexagon: Hexagon;
    public targeted: boolean;
    public radius: number;
    public gameObjectView: GameObjectView | undefined;

    public static TARGETING_OUTLINE_WIDTH = 12;
    public static OUTLINE_PADDING = 0;
    
    constructor(cell: Tile, radius: number) {
        this.globalPos = cell.pos.toHexCenter(radius)
        this.displayHexagon = new Hexagon(this.globalPos, radius * (1 - CellView.PADDING));

        this.outlineHexagon = new Hexagon(this.globalPos, radius * (1 - CellView.OUTLINE_PADDING));
        this.cell = cell;
        this.targeted = false;
        this.radius = radius;
        this.trackCellContent();
    }

    private trackCellContent(): void {
        this.cell.onContentSet = this.setContent.bind(this);
    }

    public setContent(gameObject: GameObject) {
        // console.log('New object set:', gameObject);
        if(gameObject instanceof Entity) {
            this.gameObjectView = new EntityView(gameObject, this);
        } else {
            this.gameObjectView = undefined;
        } 
    }

    public setTargeted(v: boolean) {
        this.targeted = v;
    }

    public display(cameraContext: CameraContext): void {

        if(!cameraContext.isInFieldOfView(this.displayHexagon.pos, this.radius)) return;
        
        this.drawHexagon(this.displayHexagon, cameraContext);

        cameraContext.setColor(0x999999);

        if(this.cell.movementsFromCounter > 0) {
            cameraContext.setColor(0x997777);
        } else if (this.cell.movementsToCounter > 0) {
            cameraContext.setColor(0x777777);
        }

        cameraContext.fill();


        if(this.targeted) {
            this.drawHexagon(this.outlineHexagon, cameraContext);

            cameraContext.setStroke(0x0088ff);
            cameraContext.setStrokeWidth(CellView.TARGETING_OUTLINE_WIDTH);
            cameraContext.context.lineCap = 'round';
            cameraContext.stroke();
        }

        cameraContext.debugText((this.cell.pos).toString(), this.displayHexagon.pos); 
    }

    public drawHexagon(hex: Hexagon, cameraContext: CameraContext) {
        cameraContext.beginPath();
        cameraContext.moveTo(hex.verteces[5]);
        for(let v of hex.verteces) {
            cameraContext.lineTo(v);
        }
        cameraContext.closePath();
    }

    public displayEntity(cameraContext: CameraContext) {
        if(this.gameObjectView) {
            this.gameObjectView.display(cameraContext);
        }
    }
}

export default CellView;