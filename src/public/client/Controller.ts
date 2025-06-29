import Cell from "../logic/Cell.js";
import Entity from "../logic/Entity.js";

class GameController {
    private selectedEntity: Entity | null;
    private teamId: number;

    constructor(teamId: number) {
        this.teamId = teamId;
        this.selectedEntity = null;
    }

    public onCellClicked(cell: Cell) {
        console.log(cell);
    }
}

export default GameController;