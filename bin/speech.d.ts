import { Observable, Observer, Terminable } from "./lib/common.js";
export declare class Sentence {
    private readonly events;
    private text;
    private editable;
    constructor();
    appendWords(words: string): this;
    appendEvent(callback: CallableFunction): this;
    createUtterance(): SpeechSynthesisUtterance;
}
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
};
export declare class Lecture implements Observable<LectureEvent> {
    private readonly observable;
    private readonly processes;
    private cancelling;
    private running;
    private reject;
    constructor();
    addObserver(observer: Observer<LectureEvent>): Terminable;
    appendWords(words: string): this;
    appendSentence(sentence: Sentence): this;
    appendEvent(callback: CallableFunction): this;
    appendPause(seconds: number): this;
    appendInteraction(interaction: Interaction): this;
    private appendProcess;
    start(): Promise<void>;
    cancel(): void;
    terminate(): void;
}
