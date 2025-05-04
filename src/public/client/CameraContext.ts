import Vector from "../utils/Vector";
import Camera from "./Camera";

class CameraContext {

    public static DEBUG_COLOR = 0x005500;

    private camera: Camera;
    private context: CanvasRenderingContext2D;

    private colorMap: Map<number, string>;

    constructor(camera: Camera, context: CanvasRenderingContext2D) {
        this.camera = camera;
        this.context = context;

        this.colorMap = new Map<number, string>;
    }

    globalToLocal(v: Vector): [number, number] {
        return v.add(this.camera.screenPos).sub(this.camera.pos).scale(this.camera.zoom).components();
    }

    beginPath(): void {
        this.context.beginPath();
    }

    stroke(): void {
        this.context.stroke();
    }

    fill(): void {
        this.context.fill();
    }

    fillRect(v: Vector, d: Vector): void {
        this.context.fillRect(...this.globalToLocal(v), ...d.scale(this.camera.zoom).components());
    }

    setColor(color: number): void {
        let str = this.colorMap.get(color);
        if(!str) {
            str = `#${color.toString(16).padStart(6, '0')}`;
            this.colorMap.set(color, str);
        }
        this.context.fillStyle = str;
    }

    lineTo(v: Vector): void {
        this.context.lineTo(...this.globalToLocal(v));
    }

    moveTo(v: Vector): void {
        this.context.moveTo(...this.globalToLocal(v));
    }

    debugText(text: string, v: Vector) {
        if(this.camera.debug) {
            this.context.textAlign = 'center';
            this.setColor(CameraContext.DEBUG_COLOR);
            this.context.fillText(text, ...this.globalToLocal(v));
        }
    }
}

export default CameraContext;