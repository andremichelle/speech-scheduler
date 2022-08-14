import { Observable, Observer, Terminable } from "./common.js";
export interface Process {
    start(complete: CallableFunction): Terminable;
}
export interface Interaction extends Process {
    name(): string;
}
export declare type LectureEvent = {
    type: 'sentence';
    sentence: string;
    charStart: number;
    charEnd: number;
} | {
    type: 'interaction';
    message: string;
} | {
    type: 'pause';
    seconds: number;
};
export declare class Lecture implements Observable<LectureEvent> {
    private readonly observable;
    private readonly processes;
    private paragraph;
    private cancelling;
    private running;
    private reject;
    private voice;
    constructor();
    addObserver(observer: Observer<LectureEvent>): Terminable;
    appendWords(words: string): this;
    appendEvent(callback: CallableFunction): this;
    awaitInteraction(interaction: Interaction): this;
    appendPause(seconds: number): this;
    private optCloseParagraph;
    private appendParagraph;
    private appendProcess;
    start(): Promise<void>;
    cancel(): void;
    terminate(): void;
}
