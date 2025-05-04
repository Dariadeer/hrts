import Vector from '../utils/Vector.js';
import Cell from './Cell.js';

class HexMap extends Map<number, Cell> {

    public setCell(pos: Vector, cell: Cell) {
        return this.set(pos.pack(), cell);
    }

    public getCell(pos: Vector) {
        return this.get(pos.pack());
    }

    public generateArena(radius: number) {
        let pos: Vector;
        for(let x = -radius + 1; x < radius; x++) {
            for(let y = -radius + 1; y < radius; y++) {
                if((x > 0 && y > 0) || (x < 0 && y < 0) || Math.abs(x) + Math.abs(y) < radius) {
                    pos = new Vector(x, y);
                    this.setCell(
                        pos,
                        new Cell(pos)
                    );
                }
                
            }
        }
    }
}

export default HexMap;