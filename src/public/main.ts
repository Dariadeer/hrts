import HexMap from './logic/HexMap.js';
import Camera from './client/camera/Camera.js';
import HexMapView from './client/views/HexMapView.js';
import Scene from './client/Scene.js';
import StatManager from './logic/StatManager.js';
import Entity from './logic/Entity.js';
import Vector from './utils/Vector.js';
import GameController from './client/GameController.js';
import GameEventLoop from './logic/events/GameEventLoop.js';
import ClientContext from './client/ClientContext.js';

// Game Logic

const eventLoop = new GameEventLoop();

const map = new HexMap();
map.generateArena(10);

ClientContext.setInstance(map, eventLoop);

const context = ClientContext.getInstance();

context.scene.pushView(context.map);

context.controller.handleInputs();

const entity = new Entity(new StatManager(20, 100, 0), new StatManager(100, 100, 1), 3);
map.getCell(new Vector(0, 0))?.setContent(entity);

const entity2 = new Entity(new StatManager(190, 200, 0), new StatManager(0, 6, 0.5), 2);
map.getCell(new Vector(3, 0))?.setContent(entity2);

context.camera.play();

eventLoop.run();