import Vector from "../utils/Vector.js";
import Tile from "./Tile.js";
import CastingEffect from "./events/CastingEvent.js";
import GameEventLoop from "./events/GameEventLoop.js";
import { MovementEvent } from "./events/MovementEvent.js";
import GameObject from "./GameObject.js";
import StatManager from "./StatManager.js";

class Entity extends GameObject {
    public health: StatManager;
    public energy: StatManager;
    public movementSpeed: number;
    public cell: Tile | undefined;
    public selected: boolean;
    public moving: boolean;
    public casting: boolean;

    public movementEvent: MovementEvent | undefined;
    public castingEvent: CastingEffect | undefined;

    constructor(health: StatManager, energy: StatManager, movementSpeed: number) {
        super();

        this.health = health;
        this.energy = energy
        this.movementSpeed = movementSpeed;

        this.selected = false;
        this.moving = false;
        this.casting = false;
    }

    public getFinalDestinationCell(): Tile {
        if(!this.cell) throw new Error('Undefined entity cell');
        if(!this.movementEvent) return this.cell;
        
        return this.movementEvent.getLastMovementEvent().cell;
        
    }
}

export default Entity;