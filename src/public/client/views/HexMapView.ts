import HexMap from '../../logic/HexMap.js';
import Vector from '../../utils/Vector.js';
import CameraContext from '../camera/CameraContext.js';
import CellView from './TileView.js';
import View from './View.js';

class HexMapView extends Map<number, CellView> implements View {

    public hexMap: HexMap;
    public cellSize: number;

    constructor(hexMap: HexMap, hexRadius: number) {
        super();

        this.cellSize = hexRadius;
        this.hexMap = hexMap;
        this.createViews(this.cellSize);
    }

    private createViews(hexRadius: number): void {
        for(let [id, cell] of this.hexMap.entries()) {
            const view = new CellView(cell, hexRadius);
            this.set(id, view);
        }
    }

    public display(cameraContext: CameraContext): void {
        for(let cellView of this.values()) {
            cellView.display(cameraContext);
        }

        for(let cellView of this.values()) {
            cellView.displayEntity(cameraContext);
        }
    }

    public getCellView(pos: Vector): CellView | undefined {
        return this.get(pos.pack());
    }
}

export default HexMapView;