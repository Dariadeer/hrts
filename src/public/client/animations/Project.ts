import { Model } from "./Animation.js";

class Project {
    public models: Model[];
    public animations: Animation[];

    constructor(models?: Model[], animations?: Animation[]) {
        this.models = models || [];
        this.animations = animations || [];
    }

    public createNewModel(): Model {
        const name = `Model ${this.models.length + 1}`;
        const model = new Model(name);
        this.models.push(model);
        return model;
    }

    public deleteModel(model: Model): void {
        if(this.models.includes(model)) {
            this.models.splice(this.models.indexOf(model), 1);
        }
    }
}

export default Project;