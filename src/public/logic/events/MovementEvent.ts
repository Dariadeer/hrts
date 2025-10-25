import Vector from "../../utils/Vector.js";
import Tile from "../Tile.js";
import Entity from "../Entity.js";
import GameObject from "../GameObject.js";
import GameEvent from "./GameEvent.js";
import GameEventLoop from "./GameEventLoop.js";

type MovementEventPrepared = {
    next: MovementEventPrepared | undefined,
    cell: Tile
}

class MovementEvent extends GameEvent {

    public static MovementError = new Error('Impossible movement');

    private entity: Entity;
    public cell: Tile;
    public next: MovementEventPrepared | undefined;
    public marked: boolean;

    constructor(entity: Entity, cell: Tile, time: number, eventLoop: GameEventLoop, marked?: boolean) {

        super(time, time + 1000 / entity.movementSpeed, eventLoop);

        this.entity = entity;
        this.cell = cell;
        this.marked = marked || false;

        if(!this.validate()) throw MovementEvent.MovementError;
        
    }

    public run(): void {
        this._run();

        if(this.entity.energy.getCurrentValue(this.start) >= 1) {
            this.entity.energy.use(1, this.start);
            this.entity.moving = true;
            this.entity.movementEvent = this;
            if(!this.entity.cell) throw new Error('Undefined movement source');
            this.entity.cell.movementsFromCounter++;
            this.cell.movementsToCounter++;
        } else {
            this.entity.moving = false;
            this.eventLoop.removeEvent(this);
            if(this.marked) {
                this.cell.movementsToCounter--;
            }
            this.unmarkFollowingCellMovement();
        }
    }

    public cutFollowingEvents(): void {
        this.unmarkFollowingCellMovement();
        this.next = undefined;
    }

    public validate(): boolean {
        return !(this.entity.moving && !this.marked) && this.entity.movementEvent === undefined && this.entity.cell !== undefined && this.cell.hexMap.getDistanceEstimate(this.entity.cell, this.cell) === 1;
    }

    public complete(): void {
        this._complete();
        if(!this.entity.cell) throw new Error('Undefined movement source');

        if(this.marked) {
            this.cell.movementsToCounter--;
        }
        this.cell.movementsToCounter--;
        this.entity.cell.movementsFromCounter--;

        this.entity.movementEvent = undefined;

        if(this.cell.content !== GameObject.EMPTY) {
            this.entity.moving = false;
            this.unmarkFollowingCellMovement();
            return;
        } else {
            this.entity.cell.setContent(GameObject.EMPTY);
            this.cell.setContent(this.entity);
            if(this.next) {
                try {
                    const next = new MovementEvent(this.entity, this.next.cell, this.eventLoop.time, this.eventLoop, true);
                    this.eventLoop.addEvent(next);
                    this.entity.moving = true;
                    if(this.next.next) {
                        next.next = this.next.next;
                    }
                } catch {}
            } else {
                this.entity.moving = false;
            }
        }
    }

    public unmarkFollowingCellMovement(): void {
        let last: MovementEvent | MovementEventPrepared = this;

        while(last.next !== undefined) {
            last = last.next;
            last.cell.movementsToCounter--;
        }
    }

    public currentCellPos(): Vector {
        if(!this.entity.cell) throw new Error('Undefined movement source');
        const cellCoords = Vector.lerp(this.entity.cell.pos, this.cell.pos, this.start, this.end, this.eventLoop.time - this.start);
        return cellCoords.add(this.entity.cell.pos);
    }

    static createMovementChain(entity: Entity, path: Tile[], eventLoop: GameEventLoop) {
        if(path.length === 0) return;
        let i = 0;
        let last: MovementEvent | MovementEventPrepared | undefined;
        if(entity.movementEvent) {
            last = entity.movementEvent.next;
            if(last !== undefined) {
                while(last.next !== undefined) {
                    last = last.next;
                }
                console.log(last);
            } else {
                last = entity.movementEvent
            }
        } else {
            i = 1;
            let first = new MovementEvent(entity, path[0], eventLoop.time, eventLoop);
            eventLoop.addEvent(first);
            last = first;
        }

        for(; i < path.length; i++) {
            last.next = { next: undefined, cell: path[i] };
            path[i].movementsToCounter++;
            console.log(last);
            last = last.next;
        }
    }

    public getLastMovementEvent(): MovementEvent | MovementEventPrepared {
        let last: MovementEvent | MovementEventPrepared = this;

        while(last.next !== undefined) {
            last = last.next;
        }
        
        return last;
    }
}

export {MovementEventPrepared, MovementEvent};