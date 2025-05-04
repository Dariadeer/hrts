import Cell from "../Cell.js";
import Entity from "../Entity.js";
import GameObject from "../GameObject.js";
import GameEvent from "./GameEvent.js";

class MovementEvent extends GameEvent {

    private entity: Entity;
    private cell: Cell;

    constructor(entity: Entity, cell: Cell, time: number) {

        super(time, time + 100 / entity.movementSpeed);

        this.entity = entity;
        this.cell = cell;
    }

    public run(): void {
        this._run();
    }

    public complete(): void {
        this._complete();

        this.entity.cell?.setContent(GameObject.EMPTY);
        this.cell.setContent(this.entity);
    }
}

export default MovementEvent;