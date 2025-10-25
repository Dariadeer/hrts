import GameEventLoop from "../logic/events/GameEventLoop.js";
import HexMap from "../logic/HexMap.js";
import Camera from "./camera/Camera.js";
import GameController from "./GameController.js";
import Scene from "./Scene.js";
import HexMapView from "./views/HexMapView.js";

export default class ClientContext {

    public static HEX_SIZE = 100;

    public controller: GameController;
    public camera: Camera;
    public map: HexMapView;
    public scene: Scene;

    public loop: GameEventLoop;

    private static context: ClientContext | null = null;

    constructor(controller: GameController, camera: Camera, map: HexMapView, scene: Scene, loop: GameEventLoop) {
        this.controller = controller;
        this.camera = camera;
        this.map = map;
        this.scene = scene;
        this.loop = loop;
    }

    public static getInstance(): ClientContext {
        if(!this.context) throw new Error('Game Context is undefined')

        return this.context;
    }

    public static setInstance(map: HexMap, eventLoop: GameEventLoop): void {
        const controller = new GameController(0, eventLoop);
        const scene = new Scene();
        const camera = new Camera(scene);
        const mapView = new HexMapView(map, this.HEX_SIZE);

        this.context = new ClientContext(
            controller,
            camera,
            mapView,
            scene,
            eventLoop
        )
    }
}