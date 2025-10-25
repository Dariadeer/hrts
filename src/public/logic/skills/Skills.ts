import Vector from "../../utils/Vector.js";

export type Skill = {
    name: String;
    areaOfEffect: Vector[];
    directional: boolean;

    energyCost: number;
    castTime: number;
}

export type Effect = {
    damage?: number;
    healing?: number;
    delay: number;
}

const slash: Skill = {
    name: 'Slash',
    areaOfEffect: [
        new Vector(-1, 0),
        new Vector(0, 1),
        new Vector(1, 1)
    ],
    directional: true,
    energyCost: 5,
    castTime: 1000
}

export default [ slash ];