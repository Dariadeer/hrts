import Vector from "../utils/Vector.js";
import Entity from "./Entity.js";
import { MovementEvent } from "./events/MovementEvent.js";
import GameObject from "./GameObject.js";
import HexMap from "./HexMap.js";

class Tile {
    private _content: GameObject;
    private _pos: Vector;
    public onContentSet: Function;
    public movementsToCounter: number;
    public movementsFromCounter: number;
    public hexMap: HexMap;

    constructor(pos: Vector, hexMap: HexMap,  content?: GameObject) {
        this.movementsToCounter = 0;
        this.movementsFromCounter = 0;
        this.hexMap = hexMap;
        this._pos = pos;
        this._content = content || GameObject.EMPTY;
        this.onContentSet = () => {console.log("Default OnContentSet function")};
    }
    
    public get content(): GameObject {
        return this._content;
    }

    public set content(v: GameObject) {
        this._content = v;
        if(v instanceof Entity) {
            v.cell = this;
        }
        this.onContentSet(v);
    }

    public setContent(v: GameObject): void {
        this._content = v;
        // console.log(this.content);
        if(v instanceof Entity) {
            v.cell = this;
        }
        this.onContentSet(v);
    }
    
    public get pos(): Vector {
        return this._pos;
    }
    
    
    public set pos(v : Vector) {
        this._pos = v;
    }
    
}

export default Tile;