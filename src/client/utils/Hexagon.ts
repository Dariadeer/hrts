import Vector from "./Vector.js";

class Hexagon {

    public static DEFAULT_RADIUS: number = 50;

    public pos: Vector;
    public verteces: Vector[];

    constructor(pos: Vector, radius: number) {
        this.pos = pos;
        this.verteces = new Array<Vector>(6);

        this.generateVerteces(radius || Hexagon.DEFAULT_RADIUS);
    }

    private generateVerteces(radius: number) {
        for(let i = 0; i < 6; i++) {
            this.verteces[i] = this.pos.add(Vector.direction(radius, Math.PI / 3 * i));
        }
    }
}

export default Hexagon;