class StatManager {
    public value: number;
    public max: number;
    public regen: number;
    public lastUpdate: number;

    constructor(value: number, max: number, regen: number) {
        this.value = value;
        this.max = max;
        this.regen = regen;
        this.lastUpdate = -1;
    }

    public getFraction(time: number): number {
        return this.getCurrentValue(time) / this.max;
    }

    public getCurrentValue(time: number): number {
        return Math.min(this.value + Math.floor((time - this.lastUpdate) / 1000 * this.regen), this.max);
    }

    public use(n: number, time: number): boolean {
        let value = this.getCurrentValue(time);
        if(n > value || value === 0) {
            return false;
        } else {
            if(value === this.max) {
                this.lastUpdate = time;
                this.value = this.max - n;
            } else {
                this.value--;
            }
        }

        return true;
    }
}

export default StatManager;