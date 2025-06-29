import Vector from "../../utils/Vector.js";
import CameraContext from "./CameraContext.js";
import Scene from "../Scene.js";
import CameraController from "./CameraController.js";

class Camera {

    public static DEFAULT_ZOOM_SPEED = 0.0005;
    public static DEFAULT_MOVEMENT_SPEED = 0.5;

    public zoom: number;

    public pos: Vector;
    public screenPos: Vector = Vector.zero;
    public container: HTMLElement;
    public scene: Scene;

    private previousTick: number;

    public dpr: number;
    public width: number;
    public height: number;

    public playing: boolean;
    public debug: boolean;

    public movementVector: Vector;

    // public onCellClicked: Function;

    private cameraController: CameraController;
    private cameraContext: CameraContext;
    private canvas: HTMLCanvasElement;
    private context: CanvasRenderingContext2D;

    constructor(scene: Scene, pos?: Vector, container?: HTMLElement) {

        this.canvas = document.createElement('canvas');
        this.canvas.className = 'camera';
        const context: CanvasRenderingContext2D | null = this.canvas.getContext('2d');
        if(!context) throw new Error('Failed to get the 2d rendering context of the canvas');

        this.context = context;

        this.container = container || document.body;
        this.container.append(this.canvas);

        this.previousTick = 0;

        this.dpr = window.devicePixelRatio;
        this.width = 0;
        this.height = 0;

        this.zoom = 1;

        this.pos = pos || Vector.zero;
        this.movementVector = Vector.zero;

        this.scene = scene;
        this.playing = false;

        this.cameraController = new CameraController(this, this.canvas);
        this.cameraContext = new CameraContext(this, this.context);
        this.debug = false;

        this.adjustSize();
        this.disableContextMenu();

        window.addEventListener('resize', () => this.adjustSize());
    }

    private adjustSize(): void {
        const rect = this.container.getBoundingClientRect();
        this.width = rect.width * this.dpr;
        this.height = rect.height * this.dpr;

        this.canvas.width = this.width;
        this.canvas.height = this.height;

        this.context.scale(this.dpr, this.dpr);

        this.screenPos = new Vector(this.width / 2, this.height / 2).div(this.dpr);
    }

    private disableContextMenu(): void {
        window.oncontextmenu = (e) => e.preventDefault();
    }

    public updateMovementVector(movement: Vector) {
        this.movementVector = movement;
    }

    private updatePosition(dt: number) {
        this.pos = this.pos.add(this.movementVector.scale(dt));
    }

    public play() {
        this.playing = true;
        this.previousTick = Date.now();
        this.update(this.previousTick);
    }

    public stop() {
        this.playing = false;
    }

    private clear() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    private update(time: number) {
        if(!this.playing) return;
        requestAnimationFrame(this.update.bind(this));

        const deltaTime = time - this.previousTick;
        this.previousTick = time;

        this.updatePosition(deltaTime);

        this.clear();
        for(let view of this.scene.views) {
            view.display(this.cameraContext);
        }
    }
}

export default Camera;