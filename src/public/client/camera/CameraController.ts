import Vector from "../../utils/Vector.js";
import ClientContext from "../ClientContext.js";
import GameController from "../GameController.js";
import Camera from "./Camera.js";

class CameraController {

    public static IS_ZOOM_LIMITED = true;

    private camera: Camera;
    private cameraElement: HTMLElement;

    public dragging: boolean;
    public previousDraggingPoint: Vector;

    public zoomSpeed: number;

    public mousePos: Vector | undefined;

    public movement: MovementObject;
    private movementSpeed: number;
    public movementDisabled: boolean;

    public onmousemove: Function | undefined;
    public onmousedown: Function | undefined;
    public onmouseup: Function | undefined;

    constructor(camera: Camera, cameraElement: HTMLElement) {
        this.camera = camera;
        this.cameraElement = cameraElement;

        this.zoomSpeed = Camera.DEFAULT_ZOOM_SPEED;

        this.movement = {
            w: 0, a:0, s: 0, d: 0
        };
        this.movementSpeed = Camera.DEFAULT_MOVEMENT_SPEED;
        this.movementDisabled = false;

        this.dragging = false;
        this.previousDraggingPoint = Vector.zero;

        this.init();
    }

    private init(): void {
        window.addEventListener('keydown', this.keydown.bind(this));
        window.addEventListener('keyup', this.keyup.bind(this));

        this.camera.canvas.addEventListener('wheel', this.wheel.bind(this));

        this.camera.canvas.addEventListener('mousedown', this.mousedown.bind(this));
        window.addEventListener('mouseup', this.mouseup.bind(this));
        window.addEventListener('mousemove', this.mousemove.bind(this));
    }

    private keydown(event: KeyboardEvent): void {
        if(this.movementDisabled) return;
        const key = event.key.toLowerCase();
        switch(key) {
            case 'w':
            case 'a':
            case 's':
            case 'd':
                this.movement[key] = 1;
                this.camera.updateMovementVector(this.getMovementVector());
        }
    }

    private keyup(event: KeyboardEvent): void {
        if(this.movementDisabled) return;
        const key = event.key.toLowerCase();
        switch(key) {
            case 'w':
            case 'a':
            case 's':
            case 'd':
                this.movement[key] = 0;
                this.camera.updateMovementVector(this.getMovementVector());
        }
    }

    private mousedown(event: MouseEvent): void {
        const pos = new Vector(event.x, event.y);

        if(event.button) {
            this.dragging = true;
            this.previousDraggingPoint = pos;
        }

        if(this.onmousedown) {
            this.onmousedown(event, pos);
        }
    }

    private mouseup(event: MouseEvent): void {
        if(event.button) {
            this.dragging = false;
        }
    }

    private mousemove(event: MouseEvent): void {
        this.mousePos = new Vector(event.x, event.y);

        if(this.dragging) {
            this.camera.pos = this.camera.pos.sub(this.mousePos.sub(this.previousDraggingPoint).div(this.camera.zoom));
            this.previousDraggingPoint = this.mousePos;
        }

        if(this.onmousemove) {
            this.onmousemove(event, this.mousePos);
        }
    }

    private wheel(event: WheelEvent): void {
        const zoom = this.camera.zoom;
        if(event.shiftKey) {
            this.camera.zoom = event.deltaY < 0 ? 1 : 0.5;
        } else if(CameraController.IS_ZOOM_LIMITED){
            this.camera.zoom = Math.min(1, Math.max(0.5, this.camera.zoom / (1 + Math.min(120, Math.max(-120, event.deltaY)) * this.zoomSpeed)));
        } else {
            this.camera.zoom = this.camera.zoom / (1 + Math.min(120, Math.max(-120, event.deltaY)) * this.zoomSpeed);
        }
        const deltaZoom = (1 / zoom - 1 / this.camera.zoom);
        this.camera.pos = this.camera.pos.add(new Vector(event.x, event.y).scale(deltaZoom));
        this.camera.updateMovementVector(this.getMovementVector());
    }

    private getMovementVector(): Vector {
        return new Vector(this.movement.d - this.movement.a, this.movement.s - this.movement.w).div(this.camera.zoom).scale(this.movementSpeed);
    }

    public resetMovement(): void {
        this.movement = {
            w: 0, a:0, s: 0, d: 0
        };
        this.camera.updateMovementVector(this.getMovementVector());
    }
}

type MovementObject = {
    w: number;
    a: number;
    s: number;
    d: number;
}

export default CameraController;