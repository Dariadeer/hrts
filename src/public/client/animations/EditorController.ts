import Vector from "../../utils/Vector.js";
import Camera from "../camera/Camera.js";
import { Ellipse, Model, Rect, Shape } from "./Animation.js";
import Project from "./Project.js";

class EditorController {
    public current: {
        project: Project,
        model: Model | undefined,
        selectedModel: Model | undefined,
        component: Model | Shape | undefined
    };
    public camera: Camera;

    public ui: {
        menu: {
            file: HTMLElement,
            mode: HTMLElement,
            models: HTMLElement
        },
        tools: {
            move: HTMLElement,
            resize: HTMLElement,
            rotate: HTMLElement,
            rect: HTMLElement,
            circle: HTMLElement,
            poly: HTMLElement
        },
        windows: {
            models: {
                element: HTMLElement,
                list: HTMLElement,
                new: HTMLElement,
                add: HTMLElement,
                delete: HTMLElement,
                selected? :HTMLElement,
                current?: HTMLElement
            },
            model: {
                name: HTMLInputElement,
                components: HTMLElement,
                current?: HTMLElement
            },
            properties: {
                name: HTMLInputElement,
                list: HTMLElement
            }
        }
    }

    constructor(camera: Camera) {
        this.camera = camera;
        this.current = {
            project: new Project(),
            model: undefined,
            selectedModel: undefined,
            component: undefined
        }

        this.ui = {
            menu: {
                file: document.getElementById('file') as HTMLElement,
                mode: document.getElementById('mode') as HTMLElement,
                models: document.getElementById('models') as HTMLElement
            },
            tools: {
                move: document.getElementById('move-tool') as HTMLElement,
                resize: document.getElementById('resize-tool') as HTMLElement,
                rotate: document.getElementById('rotate-tool') as HTMLElement,
                rect: document.getElementById('rect-tool') as HTMLElement,
                circle: document.getElementById('circle-tool') as HTMLElement,
                poly: document.getElementById('poly-tool') as HTMLElement
            },
            windows: {
                models: {
                    element: document.querySelector('.model-panel') as HTMLElement,
                    list: document.querySelector('.model-list') as HTMLElement,
                    new: document.getElementById('new-model') as HTMLElement,
                    add: document.getElementById('add-model') as HTMLElement,
                    delete: document.getElementById('delete-model') as HTMLElement
                },
                model: {
                    name: document.getElementById('model-name') as HTMLInputElement,
                    components: document.getElementById('components') as HTMLElement
                },
                properties: {
                    name: document.getElementById('component-name') as HTMLInputElement,
                    list: document.getElementById('properties') as HTMLElement
                }
            }
        };

        this.activateUI();
        this.activateHotkeys();
        this.alignCameraWithUI();
        window.addEventListener('resize', () => this.alignCameraWithUI());
        console.log(this);
    }

    private alignCameraWithUI() {
        this.camera.screenPosRatio = new Vector((window.innerWidth - 420) / window.innerWidth / 2, (window.innerHeight - 300) / window.innerHeight / 2);
        console.log(this.camera.screenPosRatio);
        this.camera.adjustSize();
    }

    private activateHotkeys() {
        window.addEventListener('keydown', (event) => {
            const key = event.key.toLowerCase();
            switch(key) {
                case 'escape':
                    console.log('escape');
                    this.unselectEverything();
                    break;
            }
        })
    }

    private activateUI() {
        // Tools
        this.ui.tools.rect.addEventListener('click', () => {
            if(this.current.model) {
                console.log('rect');
                this.current.model.addShape(new Rect(new Vector(0, 0), new Vector(100, 100), 'Rect ' + this.current.model.shapes.length));
                this.updateComponentList();
            } else {
                console.log('No model selected')
            }
        });

        this.ui.tools.circle.addEventListener('click', () => {
            if(this.current.model) {
                console.log('circle');
                this.current.model.addShape(new Ellipse(new Vector(0, 0), new Vector(50, 50), 'Ellipse ' + this.current.model.shapes.length));
                this.updateComponentList();
            } else {
                console.log('No model selected')
            }
        });

        // Menus
        this.ui.menu.models.addEventListener('click', () => {
            this.showElement(this.ui.windows.models.element);
        });

        // Window exits
        const exitButtons = document.querySelectorAll('.window-exit');
        for(let button of exitButtons) {
            button.addEventListener('click', () => {
                this.hideElement(button.parentElement?.parentElement as HTMLElement);
            });
        }

        // Renames
        this.ui.windows.model.name.addEventListener('input', () => {
            if(this.current.model && this.ui.windows.models.current) {
                this.current.model.name = this.ui.windows.model.name.value;
                this.ui.windows.models.current.textContent = this.current.model.name;
            }
        });
        this.disableInputMovement(this.ui.windows.model.name);

        this.ui.windows.properties.name.addEventListener('input', () => {
            if(this.current.component && this.ui.windows.model.current) {
                this.current.component.name = this.ui.windows.properties.name.value;
                const textElement = this.ui.windows.model.current.querySelector('.name');
                if(textElement) {
                    textElement.textContent = this.current.component.name;
                }
            }
        });
        this.disableInputMovement(this.ui.windows.properties.name);


        // Models window
        this.ui.windows.models.new.addEventListener('click', () => {
            this.current.project.createNewModel();
            this.updateModelList();
        });

        this.ui.windows.models.delete.addEventListener('click', () => {
            if(this.current.selectedModel) {
                this.current.project.deleteModel(this.current.selectedModel);
                this.ui.windows.models.delete.classList.add('inactive');
                if(this.current.selectedModel === this.current.model) {
                    this.unfocusModel();
                    this.unselectEverything();
                }
                this.updateComponentList();
                this.updateModelList();
            }
        });

        this.ui.windows.models.add.addEventListener('click', () => {
            if(this.current.selectedModel && this.current.model && this.current.selectedModel !== this.current.model) {
                const sourced = new Model(this.current.selectedModel.name);
                sourced.setSource(this.current.selectedModel);
                this.current.model.addShape(sourced);
                this.ui.windows.models.add.classList.add('inactive');
                this.updateComponentList();
            }
        });
    }

    public updatePropertyList() {
        this.ui.windows.properties.list.innerHTML = '';
        if(!this.current.component) {
            this.ui.windows.properties.name.value = '';
            return;
        }
        this.ui.windows.properties.name.value = this.current.component.name;
        
        const positionElement = this.createPointEditorElement(this.current.component.pos, 'Position');

        this.ui.windows.properties.list.appendChild(positionElement);

        if(this.current.component instanceof Model) return;

        const pointsElement = this.createElement('div', ['object-property']);
        const pointsNameElement = this.createElement('div', ['object-name'], 'Points');
        pointsElement.appendChild(pointsNameElement);

        let i = 0;
        for(let v of this.current.component.points) {
            const pointElement = this.createPointEditorElement(v, 'Point ' + i++, this.current.component);
            pointsElement.appendChild(pointElement);
        }

        this.ui.windows.properties.list.appendChild(pointsElement);
    }

    public updateComponentList() {
        this.ui.windows.model.components.innerHTML = '';
        if(!this.current.model) {
            this.ui.windows.model.name.value = '';
            return;
        }
        this.ui.windows.model.name.value = this.current.model.name;
        for(let component of this.current.model.shapes) {
            const componentElement = this.createElement('div', ['component']);
            const nameElement = this.createElement('div', ['name'], component.name);
            const swapUpElement = this.createElement('div', ['component-swap-up'], '▲');
            const swapDownElement = this.createElement('div', ['component-swap-down'], '▼');
            componentElement.append(nameElement, swapUpElement, swapDownElement);
            this.ui.windows.model.components.append(componentElement);
            if(this.current.component === component) {
                componentElement.classList.add('current');
                this.ui.windows.model.current = componentElement;
            }
            swapUpElement.addEventListener('click', () => {
                if(!this.current.model) return;
                let index = this.current.model.shapes.indexOf(component);
                if(index > 0) {
                    this.current.model.shapes[index] = this.current.model.shapes[index - 1];
                    this.current.model.shapes[index - 1] = component;
                    this.updateComponentList();
                }
            });
            swapDownElement.addEventListener('click', () => {
                if(!this.current.model) return;
                let index = this.current.model.shapes.indexOf(component);
                if(index != this.current.model.shapes.length - 1 && index != -1) {
                    this.current.model.shapes[index] = this.current.model.shapes[index + 1];
                    this.current.model.shapes[index + 1] = component;
                    this.updateComponentList();
                }
            });
            componentElement.addEventListener('click', (event) => {
                if(event.target !== componentElement && event.target !== nameElement) return;
                this.ui.windows.model.current?.classList.remove('current');
                this.ui.windows.model.current = componentElement;
                componentElement.classList.add('current');
                this.focusComponent(component);
            });
        }
    }
    
    public updateModelList() {
        this.ui.windows.models.list.innerHTML = '';
        for(let model of this.current.project.models) {
            const modelElement = this.createElement('div', ['model-preview'], model.name);
            if(model === this.current.model) {
                modelElement.classList.add('current');
                this.ui.windows.models.current = modelElement;
            }
            modelElement.addEventListener('click', () => {
                if(modelElement.classList.contains('selected')) {
                    modelElement.classList.remove('selected');
                    modelElement.classList.add('current');

                    this.focusModel(model);
                } else {
                    this.ui.windows.models.selected?.classList.remove('selected');
                    this.ui.windows.models.selected = modelElement;
                    modelElement.classList.add('selected');

                    this.selectModel(model);
                }
            });
            this.ui.windows.models.list.appendChild(modelElement);
        }
    }

    public unselectEverything() {
        if(this.current.component) {
            this.current.component.focused = false;
            this.current.component = undefined;
            this.updatePropertyList();
        }
        if(this.ui.windows.models.selected) {
            this.ui.windows.models.selected.classList.remove('selected');
            this.ui.windows.models.delete.classList.add('inactive');
            this.ui.windows.models.add.classList.add('inactive');
            this.ui.windows.models.selected = undefined;
        }
        if(this.ui.windows.model.current) {
            this.ui.windows.model.current.classList.remove('current');
            this.ui.windows.model.current = undefined;
        }
    }

    public focusComponent(component: Model | Shape) {
        if(this.current.component) {
            this.current.component.focused = false;
        }
        this.current.component = component;
        component.focused = true;
        this.updatePropertyList();
    }

    public selectModel(model: Model) {
        this.current.selectedModel = model;
        this.ui.windows.models.delete.classList.remove('inactive');
        if(this.current.model !== this.current.selectedModel) {
            this.ui.windows.models.add.classList.remove('inactive');
        } else {
            this.ui.windows.models.add.classList.add('inactive');
        }
    }

    public focusModel(model: Model): void {
        this.camera.scene.removeView(this.current.model as Model);
        this.current.model = model;
        this.camera.scene.pushView(model);
        this.hideElement(this.ui.windows.models.element);

        this.updateComponentList();
        this.updateModelList();
        this.unselectEverything();
    }

    public unfocusModel() {
        if(!this.current.model) return;
        this.camera.scene.removeView(this.current.model);
        this.current.model = undefined;
        this.updateComponentList();
        this.updatePropertyList();
    }

    public disableInputMovement(input: HTMLInputElement) {
        input.addEventListener('focusin', () => {
            this.camera.cameraController.movementDisabled = true;
            this.camera.cameraController.resetMovement();
        });
        input.addEventListener('focusout', () => {
            this.camera.cameraController.movementDisabled = false;
        });
    }

    public createPointEditorElement(v: Vector, name: string, shape?: Shape): HTMLElement {
        const positionElement = this.createElement('div', ['object-property']);
        const nameElement = this.createElement('div', ['object-name'], name);

        const xElement = this.createElement('div', ['primitive-property']);
        const xNameElement = this.createElement('div', ['primitive-name'], 'X:');
        const xValueElement = this.createElement('input', ['primitive-value']) as HTMLInputElement;
        xValueElement.value = v.x.toString();
        xElement.append(xNameElement, xValueElement);

        xValueElement.addEventListener('input', () => {
            console.log(this);
            const value = parseFloat(xValueElement.value);
            if(!isNaN(value)) {
                v.x = value;
                xValueElement.value = value.toString();
            }
            if(shape) shape.update();
        });

        const yElement = this.createElement('div', ['primitive-property']);
        const yNameElement = this.createElement('div', ['primitive-name'], 'Y:');
        const yValueElement = this.createElement('input', ['primitive-value']) as HTMLInputElement;
        yValueElement.value = v.y.toString();
        yElement.append(yNameElement, yValueElement);

        yValueElement.addEventListener('input', () => {
            const value = parseFloat(yValueElement.value);
            if(!isNaN(value)) {
                v.y = value;
                yValueElement.value = value.toString();
            }
            if(shape) shape.update();
        });

        positionElement.append(nameElement, xElement, yElement);

        return positionElement;
    }

    public showElement(element: HTMLElement): void {
        element.classList.remove('hidden');
    }

    public hideElement(element: HTMLElement): void {
        element.classList.add('hidden');
    }

    public createElement(type: string, classes: string[], text?: string): HTMLElement {
        const element = document.createElement(type);
        for(let _class of classes) {
            element.classList.add(_class);
        }
        element.textContent = text as string;
        return element;
    }
}

export default EditorController;    