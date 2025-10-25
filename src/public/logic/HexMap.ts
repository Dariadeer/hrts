import Vector from '../utils/Vector.js';
import Tile from './Tile.js';
import Entity from './Entity.js';
import GameObject from './GameObject.js';

type PathSegment = {
    node: Tile,
    g: number,
    h: number,
    f: number,
    prev: PathSegment | null
};

function findMinimumPathSegment(map: Map<Tile, PathSegment>): PathSegment {
    let min: PathSegment | null = null;

    for(let pathSegment of map.values()) {
        if(!min || pathSegment.f < min.f) {
            min = pathSegment;
        }
    }

    if(min === null) throw new Error('This isn\'t supposed to happen...');

    return min;
}

function backTrackPath(pathSegment: PathSegment): Tile[] {
    const path = new Array<Tile>(pathSegment.g);
    path[pathSegment.g - 1] = pathSegment.node;

    for(let i = pathSegment.g - 1; i > 0; i--) {
        if(pathSegment.prev) {
            path[i - 1] = pathSegment.prev.node;
            pathSegment = pathSegment.prev;
        }
    }

    return path;

}

class HexMap extends Map<number, Tile> {

    public setCell(pos: Vector, cell: Tile) {
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
                        new Tile(pos, this)
                    );
                }
                
            }
        }
    }

    public getNeighbourCells(cell: Tile): (Tile | undefined)[] {
        return [
            this.getCell(cell.pos.add(Vector.down)),
            this.getCell(cell.pos.add(Vector.right)),
            this.getCell(cell.pos.add(Vector.right).add(Vector.up)),
            this.getCell(cell.pos.add(Vector.up)),
            this.getCell(cell.pos.add(Vector.left)),
            this.getCell(cell.pos.add(Vector.left).add(Vector.down))
        ];
    }

    public getShortestPath(cell1: Tile, cell2: Tile, entity: Entity): Tile[] {
        const open = new Map<Tile, PathSegment>();
        const visited = new Map<Tile, PathSegment>();

        open.set(cell1, {node: cell1, g: 0, h: 0, f: 0, prev: null});

        while(open.size > 0) {
            let next = findMinimumPathSegment(open);
            visited.set(next.node, next);

            if(next.node === cell2) {
                return backTrackPath(next);
            }

            let neighbours = this.getNeighbourCells(next.node);

            for(let n of neighbours) {
                if(!n) continue;
                const g = next.g + 1;
                const h = this.getDistanceEstimate(n, cell2);

                const nSegment = open.get(n);

                const hasAnotherEntity = n.content instanceof Entity;

                if((nSegment && g > nSegment.g) || visited.has(n) || (n.content !== GameObject.EMPTY && n.content !== entity && !hasAnotherEntity)) continue;

                open.set(n, {node: n, g, h, f: g + h + (hasAnotherEntity ? 0.1 : 0), prev: next});
            }

            open.delete(next.node);
        }

        throw new Error('Impossible to find path')
    }

    public getDistanceEstimate(cell1: Tile, cell2: Tile) {
        const cellPosDiff = cell1.pos.sub(cell2.pos);
        return Math.max(Math.abs(cellPosDiff.x), Math.abs(cellPosDiff.y), Math.abs(cellPosDiff.x - cellPosDiff.y));
    }
}

export default HexMap;