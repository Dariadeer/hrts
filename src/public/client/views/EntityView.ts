import Entity from "../../logic/Entity.js";
import GameObject from "../../logic/GameObject.js";
import Vector from "../../utils/Vector.js";
import CameraContext from "../camera/CameraContext.js";
import ClientContext from "../ClientContext.js";
import CellView from "./TileView.js";
import GameObjectView from "./GameObjectView.js";
import View from "./View.js";

class EntityView extends GameObjectView implements View {

    public static DEFAULT_SIZE = 80;
    public static DEFAULT_SIZE_VECTOR = new Vector(this.DEFAULT_SIZE, this.DEFAULT_SIZE);
    public static DEFAULT_HALF_SIZE = this.DEFAULT_SIZE / 2;
    public static DEFAULT_HALF_SIZE_VECTOR = new Vector(this.DEFAULT_SIZE / 2, this.DEFAULT_SIZE / 2);

    public static STAT_BAR_HEIGHT = 8;
    public static STAT_BAR_HEIGHT_OFFSET = 8;
    public static EMPTY_BAR_COLOR = 0x555555;
    public static HEALTH_BAR_COLOR_1 = 0x00ff00;
    public static HEALTH_BAR_COLOR_2 = 0xff0000;
    public static ENERGY_BAR_COLOR = 0x0000ff;

    public static SELECTION_GLOW_WIDTH = 10;

    public gameObject: Entity;

    constructor(entity: Entity, cellView: CellView) {
        super(entity, cellView);

        this.gameObject = entity;
    }

    display(cameraContext: CameraContext): void {

        const context = ClientContext.getInstance();
        const time = context.loop.time;

        cameraContext.setColor(0x444444);
        let pos = this.cellView.globalPos;
        if(this.gameObject.movementEvent) {
            pos = this.gameObject.movementEvent.currentCellPos().toHexCenter(ClientContext.HEX_SIZE);
        }
        cameraContext.fillRect(pos.sub(EntityView.DEFAULT_HALF_SIZE_VECTOR), EntityView.DEFAULT_SIZE_VECTOR);
        // Select visuals
        if(this.gameObject.selected) {
            cameraContext.setStroke(0x999900);
            cameraContext.setStrokeWidth(EntityView.SELECTION_GLOW_WIDTH);
            cameraContext.beginPath();
            cameraContext.strokeRect(pos.sub(EntityView.DEFAULT_HALF_SIZE_VECTOR), EntityView.DEFAULT_SIZE_VECTOR);
            cameraContext.stroke();
        }
        
        
        // Stat visuals
        cameraContext.setColor(EntityView.EMPTY_BAR_COLOR);
        cameraContext.fillRect(pos.sub(EntityView.DEFAULT_HALF_SIZE_VECTOR).sub(new Vector(0, EntityView.STAT_BAR_HEIGHT * 2 + EntityView.STAT_BAR_HEIGHT_OFFSET)), new Vector(EntityView.DEFAULT_SIZE, EntityView.STAT_BAR_HEIGHT * 2))

        cameraContext.setColor(this.getHealthBarColor(this.gameObject.health.getFraction(time)));
        cameraContext.fillRect(pos.sub(EntityView.DEFAULT_HALF_SIZE_VECTOR).sub(new Vector(0, EntityView.STAT_BAR_HEIGHT * 2 + EntityView.STAT_BAR_HEIGHT_OFFSET)), new Vector(EntityView.DEFAULT_SIZE * this.gameObject.health.getFraction(time), EntityView.STAT_BAR_HEIGHT))

        cameraContext.setColor(EntityView.ENERGY_BAR_COLOR);
        cameraContext.fillRect(pos.sub(EntityView.DEFAULT_HALF_SIZE_VECTOR).sub(new Vector(0, EntityView.STAT_BAR_HEIGHT + EntityView.STAT_BAR_HEIGHT_OFFSET)), new Vector(EntityView.DEFAULT_SIZE * this.gameObject.energy.getFraction(time), EntityView.STAT_BAR_HEIGHT))
        
    }

    private getHealthBarColor(fraction: number) {
        return ((0xff * (1 - fraction)) << 16) + ((0xff * fraction) << 8);
    }
}

export default EntityView;