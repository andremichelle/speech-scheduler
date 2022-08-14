export declare type NoArgType<T> = {
    new (): T;
};
export declare const elseIfUndefined: <T>(value: T | undefined, fallback: T) => T;
export interface Terminable {
    terminate(): void;
}
export declare const TerminableVoid: Terminable;
export declare class Terminator implements Terminable {
    private readonly terminables;
    with<T extends Terminable>(terminable: T): T;
    terminate(): void;
}
export declare type EventMaps = HTMLElementEventMap & WindowEventMap & DocumentEventMap;
export declare type ListenerElements = HTMLElement | Window | Document;
export declare type EventType<E> = keyof Pick<EventMaps, {
    [K in keyof EventMaps]: EventMaps[K] extends E ? K : never;
}[keyof EventMaps]>;
export declare class Events {
    static preventDefault: (event: Event) => void;
    static toPromise<E extends Event>(target: EventTarget, type: string): Promise<E>;
    static bind<E extends EventMaps[keyof EventMaps]>(target: ListenerElements, type: EventType<E>, listener: (event: E) => void, options?: AddEventListenerOptions): Terminable;
    static configRepeatButton(button: EventTarget, callback: () => void): Terminable;
}
export interface Option<T> {
    get(): T;
    ifPresent<R>(callback: (value: T) => R): R;
    contains(value: T): boolean;
    isEmpty(): boolean;
    nonEmpty(): boolean;
    map<U>(callback: (value: T) => U): Option<U>;
}
export declare class Options {
    static valueOf<T>(value: T): Option<T>;
    static Some: {
        new <T>(value: T): {
            readonly value: T;
            get: () => T;
            contains: (value: T) => boolean;
            ifPresent: <R>(callback: (value: T) => R) => R;
            isEmpty: () => boolean;
            nonEmpty: () => boolean;
            map<U>(callback: (value: T) => U): Option<U>;
            toString(): string;
        };
    };
    static None: {
        get: () => never;
        contains: (_: never) => boolean;
        ifPresent: (_: (value: never) => never) => any;
        isEmpty: () => boolean;
        nonEmpty: () => boolean;
        map<U>(callback: (_: never) => U): Option<U>;
        toString(): string;
    };
}
export declare type Observer<VALUE> = (value: VALUE) => void;
export interface Observable<VALUE> extends Terminable {
    addObserver(observer: Observer<VALUE>, notify: boolean): Terminable;
}
export declare class ObservableImpl<T> implements Observable<T> {
    private readonly observers;
    notify(value: T): void;
    addObserver(observer: Observer<T>): Terminable;
    terminate(): void;
}
