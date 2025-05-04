import HexMap from './logic/HexMap.js';
import Camera from './visual/Camera.js';
import HexMapView from './visual/views/HexMapView.js';
import Scene from './visual/Scene.js';
import StatManager from './logic/StatManager.js';
import Entity from './logic/Entity.js';
import Vector from './utils/Vector.js';

const map = new HexMap();
map.generateArena(5);
const mapView = new HexMapView(map, 50);

const entity = new Entity(new StatManager(100, 100, 0), new StatManager(10, 10, 0), 0.01);
map.getCell(new Vector(0, 0))?.setContent(entity);

const scene = new Scene();
const camera = new Camera(scene);
// camera.debug = true;
camera.play();

scene.pushView(mapView);