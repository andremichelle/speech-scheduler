// noinspection JSUnusedGlobalSymbols

export type NoArgType<T> = { new(): T }

export const elseIfUndefined = <T>(value: T | undefined, fallback: T): T => value === undefined ? fallback : value

export interface Terminable {
    terminate(): void
}

export const TerminableVoid: Terminable = {
    terminate() {
    }
}

export class Terminator implements Terminable {
    private readonly terminables: Terminable[] = []

    with<T extends Terminable>(terminable: T): T {
        this.terminables.push(terminable)
        return terminable
    }

    terminate(): void {
        while (this.terminables.length > 0) {
            this.terminables.pop()!.terminate()
        }
    }
}

export type EventMaps = HTMLElementEventMap & WindowEventMap & DocumentEventMap
export type ListenerElements = HTMLElement | Window | Document
export type EventType<E> = keyof Pick<EventMaps, { [K in keyof EventMaps]: EventMaps[K] extends E ? K : never }[keyof EventMaps]>

export class Events {
    static preventDefault = (event: Event): void => event.preventDefault()

    static async toPromise<E extends Event>(target: EventTarget, type: string): Promise<E> {
        return new Promise<E>(resolve => target
            .addEventListener(type, (event: Event): void => resolve(event as E), { once: true }))
    }

    static bind<E extends EventMaps[keyof EventMaps]>(
        target: ListenerElements,
        type: EventType<E>,
        listener: (event: E) => void,
        options?: AddEventListenerOptions): Terminable {
        target.addEventListener(type, listener as EventListener, options)
        return { terminate: () => target.removeEventListener(type, listener as EventListener, options) }
    }

    static configRepeatButton(button: EventTarget, callback: () => void): Terminable {
        const mouseDownListener = () => {
            let lastTime = Date.now()
            let delay = 500.0
            const repeat = () => {
                if (!isNaN(lastTime)) {
                    if (Date.now() - lastTime > delay) {
                        lastTime = Date.now()
                        delay *= 0.75
                        callback()
                    }
                    requestAnimationFrame(repeat)
                }
            }
            requestAnimationFrame(repeat)
            callback()
            window.addEventListener("mouseup", () => {
                lastTime = NaN
                delay = Number.MAX_VALUE
            }, { once: true })
        }
        button.addEventListener("mousedown", mouseDownListener)
        return { terminate: () => button.removeEventListener("mousedown", mouseDownListener) }
    }
}

export interface Option<T> {
    get(): T

    ifPresent<R>(callback: (value: T) => R): R

    contains(value: T): boolean

    isEmpty(): boolean

    nonEmpty(): boolean

    map<U>(callback: (value: T) => U): Option<U>
}

export class Options {
    static valueOf<T>(value: T): Option<T> {
        return null === value || undefined === value ? Options.None : new Options.Some(value)
    }

    static Some = class <T> implements Option<T> {
        constructor(readonly value: T) {
            console.assert(null !== value && undefined !== value, "Cannot be null or undefined")
        }

        get = (): T => this.value
        contains = (value: T): boolean => value === this.value
        ifPresent = <R>(callback: (value: T) => R): R => callback(this.value)
        isEmpty = (): boolean => false
        nonEmpty = (): boolean => true

        map<U>(callback: (value: T) => U): Option<U> {
            return Options.valueOf(callback(this.value))
        }

        toString(): string {
            return `Options.Some(${this.value})`
        }
    }

    static None = new class implements Option<never> {
        get = (): never => {
            throw new Error("Option has no value")
        }
        contains = (_: never): boolean => false
        ifPresent = (_: (value: never) => never): any => {
        }
        isEmpty = (): boolean => true
        nonEmpty = (): boolean => false

        map<U>(callback: (_: never) => U): Option<U> {
            return Options.None
        }

        toString(): string {
            return 'Options.None'
        }
    }
}

export type Observer<VALUE> = (value: VALUE) => void

export interface Observable<VALUE> extends Terminable {
    addObserver(observer: Observer<VALUE>, notify: boolean): Terminable
}

export class ObservableImpl<T> implements Observable<T> {
    private readonly observers: Observer<T>[] = []

    notify(value: T) {
        this.observers.forEach(observer => observer(value))
    }

    addObserver(observer: Observer<T>): Terminable {
        this.observers.push(observer)
        return {
            terminate: () => {
                const index = this.observers.indexOf(observer)
                if (-1 < index) {
                    this.observers.splice(index, 1)
                }
            }
        }
    }

    terminate(): void {
        this.observers.splice(0, this.observers.length)
    }
}