import GameEventLoop from "./GameEventLoop.js";
import GameEventState from "./GameEventState.js";

abstract class GameEvent {
    public state: GameEventState;
    public start: number;
    public end: number;
    public eventLoop: GameEventLoop;

    constructor(start: number, end: number, eventLoop: GameEventLoop) {
        this.start = start;
        this.end = end << 0;
        this.state = GameEventState.READY;
        this.eventLoop = eventLoop;
    }

    protected _run() {
        this.state = GameEventState.RUNNING;
    }

    protected _complete() {
        this.state = GameEventState.COMPLETED;
    }

    public abstract run(): void
    public abstract complete(): void
}

export default GameEvent;