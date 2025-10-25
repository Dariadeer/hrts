import Tile from "../logic/Tile.js";
import Entity from "../logic/Entity.js";
import GameEventLoop from "../logic/events/GameEventLoop.js";
import { MovementEvent } from "../logic/events/MovementEvent.js";
import skills, { Skill } from "../logic/skills/Skills.js";
import Vector from "../utils/Vector.js";
import Camera from "./camera/Camera.js";
import ClientContext from "./ClientContext.js";
import CellView from "./views/TileView.js";

class GameController {
    public selectedEntity: Entity | null;
    public movementClick: boolean;
    public targetClick: boolean;
    public skillSelected: Skill | undefined;
    public teamId: number;
    public targetedCellViews: CellView[];

    constructor(teamId: number, eventLoop: GameEventLoop) {
        this.teamId = teamId;
        this.selectedEntity = null;
        this.movementClick = false;
        this.targetClick = false;
        this.targetedCellViews = [];

        // For before skill selection is added
        this.skillSelected = skills[0];
    }

    public onCellClicked(cell: Tile | undefined, mousePos: Vector) {
        if(!cell) return;

        const context = ClientContext.getInstance();

        if(cell.content && cell.content instanceof Entity && !this.movementClick && !this.targetClick) {
            this.unselectEverything();
            this.selectedEntity = cell.content;
            this.selectedEntity.selected = true;
        } else if(this.selectedEntity && this.selectedEntity.cell) {
            if(this.movementClick) {
                try {
                    context.loop.addEvent(
                        new MovementEvent(this.selectedEntity, cell, context.loop.time, context.loop)
                    );
                } catch {
                    MovementEvent.createMovementChain(this.selectedEntity, cell.hexMap.getShortestPath(this.selectedEntity.getFinalDestinationCell(), cell, this.selectedEntity), context.loop);

                }
                this.movementClick = false;
            } else if (this.targetClick && this.skillSelected){
                const dir = this.calculateDirectionIndex(this.selectedEntity.cell.pos.toHexCenter(ClientContext.HEX_SIZE), mousePos);
                const entityPos = this.selectedEntity.cell.pos;
                const area = this.skillSelected.areaOfEffect.map(v => v.rotateHex(dir).add(entityPos));

                console.log(dir, area);
            }
            
        }
    }

    public onTargeting(cell: Tile | undefined, mousePos: Vector) {
        if(this.selectedEntity && this.selectedEntity.cell && this.skillSelected) {
            this.deleteTargeting();

            const context = ClientContext.getInstance();

            const dir = this.calculateDirectionIndex(this.selectedEntity.cell.pos.toHexCenter(ClientContext.HEX_SIZE), mousePos);
            const entityPos = this.selectedEntity.cell.pos;
            const area = this.skillSelected.areaOfEffect.map(v => v.rotateHex(dir).add(entityPos));

            let cellView;
            for(let cellPos of area) {
                cellView = context.map.getCellView(cellPos);
                if(cellView) {
                    cellView.setTargeted(true);
                    this.targetedCellViews.push(cellView);
                }
                
            }
        }
    }

    public deleteTargeting() {
        for(let i = 0; i < this.targetedCellViews.length; i++) {
            this.targetedCellViews[i].setTargeted(false);
        }

        this.targetedCellViews = [];
    }

    private calculateDirectionIndex(pos1: Vector, pos2: Vector) {
        const dir = pos2.sub(pos1);
        return (((dir.angle() - Math.PI / 3) / Math.PI * 3 + 6) % 6) << 0;
    }

    public handleInputs() {
        const context = ClientContext.getInstance();

        window.addEventListener('keydown', (event: KeyboardEvent) => {

            switch(event.key) {
                case 'x':
                    this.unselectEverything();
                    break;
                case 'q':
                    if(this.selectedEntity) {
                        this.deleteTargeting();
                        this.movementClick = true;
                        this.targetClick = false;
                    }
                    break;
                case 'e':
                    if(this.selectedEntity) {
                        this.deleteTargeting();
                        this.targetClick = !this.targetClick;
                        if(this.targetClick && context.camera.cameraController.mousePos) {
                            this.onTargeting(undefined, context.camera.cameraController.mousePos);
                        }
                        this.movementClick = false;
                    }
                    break;
                case 'c':
                    this.selectedEntity?.movementEvent?.cutFollowingEvents();
                    break;
            }
        });

        context.camera.cameraController.onmousedown = (event: MouseEvent, mousePos: Vector) => {
            if(!event.button) {
                const globalPos = context.camera.cameraContext.localToGlobal(mousePos);
                const cellPos = globalPos.toHex(ClientContext.HEX_SIZE);
                const cell = context.map.hexMap.getCell(cellPos);
                this.onCellClicked(cell, globalPos);
            }
            
        }

        context.camera.cameraController.onmousemove = (event: MouseEvent, mousePos: Vector) => {
            if(this.targetClick) {
                const globalPos = context.camera.cameraContext.localToGlobal(mousePos);
                const cellPos = globalPos.toHex(ClientContext.HEX_SIZE);
                const cell = context.map.hexMap.getCell(cellPos);
                context.controller.onTargeting(cell, globalPos);
            }
        }
    }

    private unselectEverything() {
        if(!this.selectedEntity) return;
        this.selectedEntity.selected = false;
        this.selectedEntity = null;
        this.movementClick = false;
    }
    
}

export default GameController;