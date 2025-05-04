import HexMap from '../../logic/HexMap.js';
import CameraContext from '../CameraContext.js';
import CellView from './CellView.js';
import View from './View.js';

class HexMapView implements View {

    private hexMap: HexMap;
    public cellViews: CellView[];

    constructor(hexMap: HexMap, hexRadius: number) {

        this.hexMap = hexMap;
        this.cellViews = [];
        this.createViews(hexRadius);
    }

    private createViews(hexRadius: number): void {
        for(let [, cell] of this.hexMap.entries()) {
            this.cellViews.push(new CellView(cell, hexRadius))
        }
    }

    public display(cameraContext: CameraContext): void {
        for(let cellView of this.cellViews) {
            cellView.display(cameraContext);
        }
    }
}

export default HexMapView;