var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export const elseIfUndefined = (value, fallback) => value === undefined ? fallback : value;
export const TerminableVoid = {
    terminate() {
    }
};
export class Terminator {
    constructor() {
        this.terminables = [];
    }
    with(terminable) {
        this.terminables.push(terminable);
        return terminable;
    }
    terminate() {
        while (this.terminables.length > 0) {
            this.terminables.pop().terminate();
        }
    }
}
export class Events {
    static toPromise(target, type) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(resolve => target
                .addEventListener(type, (event) => resolve(event), { once: true }));
        });
    }
    static bind(target, type, listener, options) {
        target.addEventListener(type, listener, options);
        return { terminate: () => target.removeEventListener(type, listener, options) };
    }
    static configRepeatButton(button, callback) {
        const mouseDownListener = () => {
            let lastTime = Date.now();
            let delay = 500.0;
            const repeat = () => {
                if (!isNaN(lastTime)) {
                    if (Date.now() - lastTime > delay) {
                        lastTime = Date.now();
                        delay *= 0.75;
                        callback();
                    }
                    requestAnimationFrame(repeat);
                }
            };
            requestAnimationFrame(repeat);
            callback();
            window.addEventListener("mouseup", () => {
                lastTime = NaN;
                delay = Number.MAX_VALUE;
            }, { once: true });
        };
        button.addEventListener("mousedown", mouseDownListener);
        return { terminate: () => button.removeEventListener("mousedown", mouseDownListener) };
    }
}
Events.preventDefault = (event) => event.preventDefault();
export class Options {
    static valueOf(value) {
        return null === value || undefined === value ? Options.None : new Options.Some(value);
    }
}
Options.Some = class {
    constructor(value) {
        this.value = value;
        this.get = () => this.value;
        this.contains = (value) => value === this.value;
        this.ifPresent = (callback) => callback(this.value);
        this.isEmpty = () => false;
        this.nonEmpty = () => true;
        console.assert(null !== value && undefined !== value, "Cannot be null or undefined");
    }
    map(callback) {
        return Options.valueOf(callback(this.value));
    }
    toString() {
        return `Options.Some(${this.value})`;
    }
};
Options.None = new class {
    constructor() {
        this.get = () => {
            throw new Error("Option has no value");
        };
        this.contains = (_) => false;
        this.ifPresent = (_) => {
        };
        this.isEmpty = () => true;
        this.nonEmpty = () => false;
    }
    map(callback) {
        return Options.None;
    }
    toString() {
        return 'Options.None';
    }
};
export class ObservableImpl {
    constructor() {
        this.observers = [];
    }
    notify(value) {
        this.observers.forEach(observer => observer(value));
    }
    addObserver(observer) {
        this.observers.push(observer);
        return {
            terminate: () => {
                const index = this.observers.indexOf(observer);
                if (-1 < index) {
                    this.observers.splice(index, 1);
                }
            }
        };
    }
    terminate() {
        this.observers.splice(0, this.observers.length);
    }
}
//# sourceMappingURL=common.js.map