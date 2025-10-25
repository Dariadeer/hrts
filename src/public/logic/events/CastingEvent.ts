import Entity from "../Entity.js";
import { Skill } from "../skills/Skills.js";
import GameEvent from "./GameEvent.js";
import GameEventLoop from "./GameEventLoop.js";

class CastingEffect extends GameEvent {

    public caster: Entity;
    public skill: Skill;

    constructor(caster: Entity, skill: Skill, time: number, eventLoop: GameEventLoop) {
        super(time, time + skill.castTime, eventLoop);
        this.caster = caster;
        this.skill = skill;
    }

    public run(): void {
        this._run();

        if(this.validate()) {
            this.caster.energy.use(this.skill.energyCost, this.start);

        }
    }

    public complete(): void {
        this._complete();
    }

    public validate(): boolean {
        return this.caster.energy.getCurrentValue(this.start) >= this.skill.energyCost && !this.caster.moving;
    }
}

export default CastingEffect;
