class StatManager {
    public value: number;
    public max: number;
    public regen: number;

    constructor(value: number, max: number, regen: number) {
        this.value = value;
        this.max = max;
        this.regen = regen;
    }
}

export default StatManager;