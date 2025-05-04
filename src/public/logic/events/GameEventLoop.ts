import GameEvent from "./GameEvent.js";
import GameEventState from "./GameEventState.js";

class GameEventLoop {

    public static DEFAULT_INTERVAL = 20;

    private events: GameEvent[];
    private start: number | undefined;
    private interval: number;

    constructor(interval?: number) {
        this.events = [];
        this.interval = interval || GameEventLoop.DEFAULT_INTERVAL;
    }

    public run() {
        this.start = Date.now();
        setInterval(() => this.update(this.getCurrentTime()), this.interval);
    }

    private update(now: number): void {
        let i = 0;
        for(let event of this.events) {
            if(event.state === GameEventState.READY && event.start <= now) {
                event.run();
            }
            if(event.state === GameEventState.RUNNING && event.end <= now) {
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
}

export default GameEventLoop;