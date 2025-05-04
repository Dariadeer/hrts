import Vector from "../utils/Vector.js";
import Cell from "./Cell.js";
import GameObject from "./GameObject.js";
import StatManager from "./StatManager.js";

class Entity extends GameObject {
    public health: StatManager;
    public energy: StatManager;
    public movementSpeed: number;
    public cell: Cell | undefined;

    constructor(health: StatManager, energy: StatManager, movementSpeed: number) {
        super();

        this.health = health;
        this.energy = energy
        this.movementSpeed = movementSpeed;
    }
}

export default Entity;