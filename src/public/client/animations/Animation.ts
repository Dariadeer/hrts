import { off } from "process";
import Vector from "../../utils/Vector.js";
import CameraContext from "../camera/CameraContext.js";
import View from "../views/View.js";

class Shape implements View {

    public static POINT_DISPLAY_WIDTH = new Vector(10, 10);
    public static POINT_DISPLAY_HALF_WIDTH = new Vector(5, 5);
    public static POINT_DISPLAY_OUTLINE_WIDTH = 5;


    public name: string;
    public pos: Vector;
    public size: Vector;
    public rot: number;
    public points: Vector[];
    public color: number;
    public focused: boolean;

    constructor(pos: Vector, name: string, size?: Vector, rot?: number, color?: number) {
        this.pos = pos;
        this.name = name;
        this.size = size || new Vector(1, 1);
        this.rot = rot || 0;
        this.color = color || 0xffffff;
        this.points = [];
        this.focused = false;
    }

    public display(cameraContext: CameraContext, offset: Vector = Vector.zero): void {
        this.outline(cameraContext, offset);
        cameraContext.setColor(this.color);
        cameraContext.fill();
    }

    public outline(cameraContext: CameraContext, offset: Vector = Vector.zero) {
        cameraContext.beginPath();
        cameraContext.moveTo(this.points[this.points.length - 1].add(this.pos).add(offset));
        for(let v of this.points) {
            cameraContext.lineTo(v.add(this.pos).add(offset));
        }
        cameraContext.closePath();
    }

    public highlight(cameraContext: CameraContext, offset: Vector = Vector.zero) {
        this.outline(cameraContext, offset);
        this.highlightEdges(cameraContext, offset);
        this.displayPoints(cameraContext, offset);
    }

    public displayPoints(cameraContext: CameraContext, offset: Vector = Vector.zero) {
        for(let v of this.points) {
            cameraContext.beginPath();
            cameraContext.setStroke(0x000000);
            cameraContext.setStrokeWidth(Shape.POINT_DISPLAY_OUTLINE_WIDTH, true);
            cameraContext.strokeRectAround(v.add(this.pos).add(offset), Shape.POINT_DISPLAY_WIDTH, true);
            cameraContext.stroke();
            cameraContext.setColor(0xffffff);
            cameraContext.fillRectAround(v.add(this.pos).add(offset), Shape.POINT_DISPLAY_WIDTH, true);
        }
    }

    public highlightEdges(cameraContext: CameraContext, offset: Vector = Vector.zero): void {
        cameraContext.context.lineCap = 'round';
        cameraContext.setStroke(0x000000);
        cameraContext.setStrokeWidth(10, true);
        cameraContext.stroke();

        cameraContext.setStroke(0xffffff);
        cameraContext.setStrokeWidth(5, true);
        cameraContext.stroke();
    }

    public update() {

    }
}

class Keyframe {
    public time: number;

    constructor(time: number, pos: Vector, size?: Vector, rot?: number) {
        // Implement with verticies
        this.time = time;
    }
}

class Ellipse extends Shape implements View {
    public radius: Vector;
    public controlPoints: Vector[] = [];

    constructor(pos: Vector, radius: Vector, name: string, size?: Vector, rot?: number) {
        super(pos, name, size, rot);

        this.radius = radius;

        this.points = [
            new Vector(radius.x, 0),
            new Vector(0, radius.y),
            new Vector(-radius.x, 0),
            new Vector(0, -radius.y)
        ]

        this.setControlPoints();

        this.color = 0x666600;
    }

    public setControlPoints(): void {
        this.controlPoints = [
            Vector.zero,
            new Vector(this.points[0].x, this.points[1].y),
            new Vector(this.points[2].x, this.points[1].y),
            new Vector(this.points[2].x, this.points[3].y),
            new Vector(this.points[0].x, this.points[3].y),
        ]
    }

    public update(): void {
        this.setControlPoints();
    }

    public display(cameraContext: CameraContext, offset: Vector = Vector.zero): void {
        this.outline(cameraContext, offset);
        cameraContext.setColor(this.color);
        cameraContext.fill();
    }

    public outline(cameraContext: CameraContext, offset: Vector = Vector.zero): void {
        cameraContext.beginPath();
        cameraContext.moveTo(this.points[0].add(this.pos).add(offset));
        for(let i = 1; i < 4; i++) {
            cameraContext.quadraticCurveTo(this.controlPoints[i].add(this.pos).add(offset), this.points[i].add(this.pos).add(offset));
        }
        cameraContext.quadraticCurveTo(this.controlPoints[4].add(this.pos).add(offset), this.points[0].add(this.pos).add(offset));
        cameraContext.closePath();
    }
}

class Rect extends Shape implements View {
    public dimensions: Vector;

    constructor(pos: Vector, dimensions: Vector, name: string, size?: Vector, rot?: number) {
        super(pos, name, size, rot);

        if (dimensions.x <= 0 || dimensions.y <= 0) {
            throw new Error("Rectangle dimensions must be greater than zero");
        }
        this.dimensions = dimensions || new Vector(1, 1);

        const halfDiagonal = dimensions.div(2);
        this.points.push(new Vector(halfDiagonal.x, halfDiagonal.y));
        this.points.push(new Vector(-halfDiagonal.x, halfDiagonal.y));
        this.points.push(new Vector(-halfDiagonal.x, -halfDiagonal.y));
        this.points.push(new Vector(halfDiagonal.x, -halfDiagonal.y));

    }

    // public display(cameraContext: CameraContext): void {
    //     cameraContext.setColor(this.color);
    //     cameraContext.fillRect(this.pos.sub(this.dimensions.div(2)), this.dimensions);
    // }
}

class Poly extends Shape implements View {
    public verts: Vector[];

    constructor(pos: Vector, verts: Vector[], name: string, size?: Vector, rot?: number) {
        super(pos, name, size, rot);

        if (verts.length < 3) {
            throw new Error("Polygon must have at least 3 vertices");
        }
        this.verts = verts;
    }
}

class Model implements View {
    public name: string;
    public shapes: (Shape | Model)[];
    public pos: Vector;
    public source?: Model;
    public focused: boolean;

    constructor(name: string, pos?: Vector) {
        this.shapes = [];

        this.name = name;
        this.pos = pos || new Vector(0, 0);
        this.focused = false;
    }

    public setSource(model: Model) {
        this.source = model;
        this.shapes = [];
    }

    public addShape(shape: Shape | Model): Model {
        if(this.source) throw new Error('This Model is a copy and cannot be edited directly');
        this.shapes.push(shape);
        return this;
    }

    highlight() {

    }

    display(cameraContext: CameraContext, offset: Vector = Vector.zero): void {
        let focused: Model | Shape | null = null;

        if(this.source) {
            for(let shape of this.source.shapes) {
                shape.display(cameraContext, this.pos.add(offset));
            }
        } else {
            for(let shape of this.shapes) {
                shape.display(cameraContext);
                if(shape.focused) {
                    focused = shape;
                }
            }
        }

        if(focused) {
            focused.highlight(cameraContext);
        }
    }
}

class Animation {

    public model: Model;

    public modelKeyframes: Map<Shape, Keyframe[]>;
    public duration: number;

    constructor(model: Model, duration: number) {
        this.modelKeyframes = new Map();
        this.model = model;
        this.duration = duration;
    }

    public addKeyframe(shape: Shape, keyframe: Keyframe): Animation {
        const shapeKeyframes = this.modelKeyframes.get(shape);
        if(shapeKeyframes) {
            shapeKeyframes.push(keyframe);
            // Sorting keyframes in asc order by time
            this.modelKeyframes.set(shape, shapeKeyframes.sort((a, b) => a.time - b.time));
        } else {
            if(this.model.shapes.includes(shape)) {
                this.modelKeyframes.set(shape, [keyframe]);
            }
        }
        return this;
    }
}

// class AnimatedModel extends Model {

//     public animations: Animation[];

//     constructor() {
//         super();

//         this.animations = [];
//     }
// }

export { Shape, Keyframe, Ellipse, Rect, Poly, Model, Animation };