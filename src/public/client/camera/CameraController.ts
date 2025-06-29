import Vector from "../../utils/Vector.js";
import Camera from "./Camera.js";

class CameraController {

    private camera: Camera;
    private cameraElement: HTMLElement;

    public dragging: boolean;
    public previousDraggingPoint: Vector;

    public zoomSpeed: number;

    public movement: MovementObject;
    private movementSpeed: number;

    constructor(camera: Camera, cameraElement: HTMLElement) {
        this.camera = camera;
        this.cameraElement = cameraElement;

        this.zoomSpeed = Camera.DEFAULT_ZOOM_SPEED;


        this.movement = {
            w: 0, a:0, s: 0, d: 0
        };
        this.movementSpeed = Camera.DEFAULT_MOVEMENT_SPEED;

        this.dragging = false;
        this.previousDraggingPoint = Vector.zero;

        this.init();
    }

    private init(): void {
        window.addEventListener('keydown', this.keydown.bind(this));
        window.addEventListener('keyup', this.keyup.bind(this));

        window.addEventListener('wheel', this.wheel.bind(this));

        this.cameraElement.addEventListener('mousedown', this.mousedown.bind(this));
        window.addEventListener('mouseup', this.mouseup.bind(this));
        window.addEventListener('mousemove', this.mousemove.bind(this));
    }

    private keydown(event: KeyboardEvent): void {
        switch(event.key) {
            case 'w':
            case 'a':
            case 's':
            case 'd':
                this.movement[event.key] = 1;
                this.camera.updateMovementVector(this.getMovementVector());
        }
    }

    private keyup(event: KeyboardEvent): void {
        switch(event.key) {
            case 'w':
            case 'a':
            case 's':
            case 'd':
                this.movement[event.key] = 0;
                this.camera.updateMovementVector(this.getMovementVector());
        }
    }

    private mousedown(event: MouseEvent): void {
        if(event.button) {
            this.dragging = true;
            this.previousDraggingPoint = new Vector(event.x, event.y);
        }
    }

    private mouseup(event: MouseEvent): void {
        if(event.button) {
            this.dragging = false;
        }
    }

    private mousemove(event: MouseEvent): void {
        if(this.dragging) {
            const currentDraggingPoint = new Vector(event.x, event.y);
            this.camera.pos = this.camera.pos.sub(currentDraggingPoint.sub(this.previousDraggingPoint).div(this.camera.zoom));
            this.previousDraggingPoint = currentDraggingPoint;
        }
    }

    private wheel(event: WheelEvent): void {
        const zoom = this.camera.zoom;
        this.camera.zoom /= 1 + event.deltaY * this.zoomSpeed;
        const deltaZoom = (1 / zoom - 1 / this.camera.zoom);
        this.camera.pos = this.camera.pos.add(new Vector(deltaZoom * event.x, deltaZoom * event.y));
        this.camera.updateMovementVector(this.getMovementVector());
    }

    private getMovementVector(): Vector {
        return new Vector(this.movement.d - this.movement.a, this.movement.s - this.movement.w).div(this.camera.zoom).scale(this.movementSpeed);
    }
}

type MovementObject = {
    w: number;
    a: number;
    s: number;
    d: number;
}

export default CameraController;