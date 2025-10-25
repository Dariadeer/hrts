import Vector from "../../utils/Vector";
import Camera from "./Camera";

class CameraContext {

    public static DEBUG_COLOR = 0x005500;

    public camera: Camera;
    public context: CanvasRenderingContext2D;

    private colorMap: Map<number, string>;

    constructor(camera: Camera, context: CanvasRenderingContext2D) {
        this.camera = camera;
        this.context = context;

        this.colorMap = new Map<number, string>;
    }

    globalToLocal(v: Vector): Vector {
        return v.add(this.camera.screenPos).sub(this.camera.pos).scale(this.camera.zoom);
    }

    localToGlobal(v: Vector) {
        return v.div(this.camera.zoom).sub(this.camera.screenPos).add(this.camera.pos);
    }

    globalToLocalAsArray(v: Vector): [number, number] {
        return this.globalToLocal(v).components();
    }

    beginPath(): void {
        this.context.beginPath();
    }

    closePath(): void {
        this.context.closePath();
    }

    stroke(): void {
        this.context.stroke();
    }

    fill(): void {
        this.context.fill();
    }

    fillRectAround(v: Vector, d: Vector, zoomIndependent?: boolean): void {
        if(zoomIndependent) {
            this.context.fillRect(...this.globalToLocal(v).sub(d.div(2)).components(), ...d.components());
        } else {
            this.context.fillRect(...this.globalToLocal(v).sub(d.div(2).scale(this.camera.zoom)).components(), ...d.scale(this.camera.zoom).components());
        }
    }

    fillRect(v: Vector, d: Vector): void {
        this.context.fillRect(...this.globalToLocalAsArray(v), ...d.scale(this.camera.zoom).components());
    }

    strokeRect(v: Vector, d: Vector): void {
        this.context.rect(...this.globalToLocalAsArray(v), ...d.scale(this.camera.zoom).components());
    }

    strokeRectAround(v: Vector, d: Vector, zoomIndependent?: boolean): void {
        if(zoomIndependent) {
            this.context.rect(...this.globalToLocal(v).sub(d.div(2)).components(), ...d.components());
        } else {
            this.context.rect(...this.globalToLocal(v).sub(d.div(2).scale(this.camera.zoom)).components(), ...d.scale(this.camera.zoom).components());
        }
    }

    setColor(color: number): void {
        let str = this.colorMap.get(color);
        if(!str) {
            str = `#${color.toString(16).padStart(6, '0')}`;
            this.colorMap.set(color, str);
        }
        this.context.fillStyle = str;
    }

    setStroke(color: number): void {
        let str = this.colorMap.get(color);
        if(!str) {
            str = `#${color.toString(16).padStart(6, '0')}`;
            this.colorMap.set(color, str);
        }
        this.context.strokeStyle = str;
    }

    setStrokeWidth(w: number, zoomIndependent?: boolean) {
        if(zoomIndependent) {
            this.context.lineWidth = w;
        } else {
            this.context.lineWidth = w * this.camera.zoom;
        }
    }

    lineTo(v: Vector): void {
        this.context.lineTo(...this.globalToLocalAsArray(v));
    }

    quadraticCurveTo(c: Vector, v: Vector) {
        this.context.quadraticCurveTo(...this.globalToLocalAsArray(c), ...this.globalToLocalAsArray(v));
    }

    moveTo(v: Vector): void {
        this.context.moveTo(...this.globalToLocalAsArray(v));
    }

    debugText(text: string, v: Vector): void {
        if(this.camera.debug) {
            this.context.font = 'bold ' + ((this.camera.zoom * 20) | 0) + 'px serif';
            this.context.textAlign = 'center';
            this.setColor(CameraContext.DEBUG_COLOR);
            this.context.fillText(text, ...this.globalToLocalAsArray(v));
        }
    }

    isInFieldOfView(v: Vector, globalMargin: number): boolean {
        const localPos = this.globalToLocal(v);
        const localMargin = globalMargin * this.camera.zoom;
        return localPos.x > -localMargin && localPos.y > -localMargin 
            && localPos.x < localMargin + this.camera.width 
            && localPos.y < localMargin + this.camera.height;
    }
}

export default CameraContext;