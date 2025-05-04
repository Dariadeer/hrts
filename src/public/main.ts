import HexMap from './logic/HexMap.js';
import Camera from './client/Camera.js';
import HexMapView from './client/views/HexMapView.js';
import Scene from './client/Scene.js';
import StatManager from './logic/StatManager.js';
import Entity from './logic/Entity.js';
import Vector from './utils/Vector.js';

const map = new HexMap();
map.generateArena(100);
const mapView = new HexMapView(map, 50);

const entity = new Entity(new StatManager(100, 100, 0), new StatManager(10, 10, 0), 0.01);
map.getCell(new Vector(0, 0))?.setContent(entity);

const scene = new Scene();
const camera = new Camera(scene);
// camera.debug = true;
camera.play();

scene.pushView(mapView);