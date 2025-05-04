import GameEventState from "./GameEventState.js";

abstract class GameEvent {
    public state: GameEventState;
    public start: number;
    public end: number;

    constructor(start: number, end: number) {
        this.start = start;
        this.end = end;
        this.state = GameEventState.READY;
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