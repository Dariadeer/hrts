import Vector from "../utils/Vector.js";
import CameraContext from "./CameraContext.js";
import Scene from "./Scene.js";

class Camera {

    public static DEFAULT_ZOOM_SPEED = 0.0005;
    public static DEFAULT_MOVEMENT_SPEED = 0.2;

    public pos: Vector;
    public screenPos: Vector = Vector.zero;
    public container: HTMLElement;
    public scene: Scene;

    private previousTick: number;

    public zoom: number;
    public zoomSpeed: number;

    private movement: { w: number, a: number, s: number, d: number };
    private movementVector: Vector;
    private movementSpeed: number;

    public playing: boolean;
    public debug: boolean;

    private cameraContext: CameraContext;
    private canvas: HTMLCanvasElement;
    private context: CanvasRenderingContext2D;
     

    constructor(scene: Scene, pos?: Vector, container?: HTMLElement) {

        this.canvas = document.createElement('canvas');
        const context: CanvasRenderingContext2D | null = this.canvas.getContext('2d');
        if(!context) throw new Error('Failed to get the 2d rendering context of the canvas');

        this.context = context;

        this.container = container || document.body;
        this.container.append(this.canvas);

        this.previousTick = 0;

        this.pos = pos || Vector.zero;
        this.zoom = 1;
        this.zoomSpeed = Camera.DEFAULT_ZOOM_SPEED;

        this.movement = {
            w: 0, a:0, s: 0, d: 0
        };
        this.movementVector = Vector.zero;
        this.movementSpeed = Camera.DEFAULT_MOVEMENT_SPEED;

        this.scene = scene;
        this.playing = false;

        this.cameraContext = new CameraContext(this, this.context);
        this.debug = false;

        this.adjustSize();
        this.handleResize();
        this.handleInputs();
    }

    private adjustSize(): void {
        const rect = this.container.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
        this.screenPos = new Vector(this.canvas.width / 2, this.canvas.height / 2);
    }

    private handleResize(): void {
        window.addEventListener('resize', () => this.adjustSize());
    }

    private handleInputs(): void {
        window.addEventListener('wheel', (event) => {
            const zoom = this.zoom;
            this.zoom /= 1 + event.deltaY * this.zoomSpeed;
            const deltaZoom = (1 / zoom - 1 / this.zoom);
            this.pos = this.pos.add(new Vector(deltaZoom * event.x, deltaZoom * event.y));
        });

        window.addEventListener('keydown', (e) => {
            switch(e.key) {
                case 'w':
                case 'a':
                case 's':
                case 'd':
                    this.movement[e.key] = 1;
                    this.updateMovementVector();
            }
        });

        window.addEventListener('keyup', (e) => {
            switch(e.key) {
                case 'w':
                case 'a':
                case 's':
                case 'd':
                    this.movement[e.key] = 0;
                    this.updateMovementVector();
            }
        });
    }

    private updateMovementVector() {
        this.movementVector = new Vector(this.movement.d - this.movement.a, this.movement.s - this.movement.w).normalise().scale(this.movementSpeed);
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