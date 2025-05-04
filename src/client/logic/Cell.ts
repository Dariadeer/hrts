import Vector from "../utils/Vector.js";
import Entity from "./Entity.js";
import GameObject from "./GameObject.js";

class Cell {
    private _content: GameObject;
    private _pos: Vector;
    public onContentSet: Function;

    constructor(pos: Vector, content?: GameObject) {
        this._pos = pos;
        this._content = content || GameObject.EMPTY;
        this.onContentSet = () => {console.log("Default function")};
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

export default Cell;