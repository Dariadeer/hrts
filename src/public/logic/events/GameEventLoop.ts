import GameEvent from "./GameEvent.js";
import GameEventState from "./GameEventState.js";

class GameEventLoop {

    public static DEFAULT_INTERVAL = 20;

    private events: GameEvent[];
    private start: number | undefined;
    private previousTick: number;
    private interval: number;
    public time: number;

    constructor(interval?: number) {
        this.time = 0;
        this.previousTick = -1;
        this.events = [];
        this.interval = interval || GameEventLoop.DEFAULT_INTERVAL;
    }

    public run() {
        this.previousTick = Date.now();
        this.time = 0;
        setInterval(() => this.update(this.getCurrentTime()), this.interval);
    }

    private update(t: number): void {
        const dt = t - this.previousTick;
        this.previousTick = t;
        this.time += dt;
        let i = 0;
        for(let event of this.events) {
            if(event.state === GameEventState.READY && event.start <= this.time) {
                event.run();
            }
            if(event.state === GameEventState.RUNNING && event.end <= this.time) {
                event.complete(); 
                this.events.splice(i, 1);
                i--;
            }
            i++;
        }
    }

    private getCurrentTime(): number {
        return Date.now();
    }

    public addEvent(event: GameEvent): void {
        this.events.push(event);
    }

    public addEventImmeditaly(event: GameEvent): void {
        this.events.push(event);
        event.run();
    }

    public removeEvent(event: GameEvent): void {
        for(let i = 0; i < this.events.length; i++) {
            if(this.events[i] === event) {
                this.events.splice(i, 1);
                return;
            }
        }
    }
}

export default GameEventLoop;