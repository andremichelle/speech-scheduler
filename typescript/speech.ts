import { Option, Options, Terminable, TerminableVoid } from "./lib/common.js"

/**
 * Since the web-speech-api does not really understand SSML (which would support breaks and markers), 
 * we have to workaround to embed events between words and actions, the user has to perform between sentences.
 * The boundary event is a great help, but if you pause the speech, it glitches and sounds broken. 
 * Hence we can only wait for user-interactions (processes) between sentences.
 * 
 * Sentence(text: string)
 *  .appendWords(words: string): this
 *  .appendEvent(callback: () => void): this
 * 
 * Lecture
 *  .appendWords(words: string): this
 *  .appendSentence(sentence: Sentence): this
 *  .appendEvent(callback: () => void): this
 *  .appendProcess(process: Process): this
 */

export type Callback = () => void

export class Sentence {
    private readonly events: { charIndex: number, callback: Callback }[] = []

    private editable: boolean = true

    constructor(private text: string = '') {
    }

    appendWords(words: string): this {
        console.assert(this.editable)
        this.text += ' ' + words.trim() // force boundary
        return this
    }

    appendEvent(callback: Callback): this {
        console.assert(this.editable)
        this.events.push({ charIndex: this.text.length, callback })
        return this
    }

    createUtterance(): SpeechSynthesisUtterance {
        const utterance = new SpeechSynthesisUtterance(this.text)
        utterance.addEventListener('start', () => this.editable = false)
        utterance.addEventListener('end', () => this.editable = true)
        if (this.events.length > 0) {
            const events = this.events.slice()
            utterance.onboundary = (event: SpeechSynthesisEvent) => {
                if (events.length > 0) {
                    if (event.charIndex >= events[0].charIndex) {
                        events.shift().callback()
                    }
                }
            }
        }
        return utterance
    }
}


export interface Process {
    start(complete: Callback): Terminable
}

export class Lecture {
    private readonly synth = window.speechSynthesis

    private readonly processes: Process[] = []

    private reject: Option<CallableFunction> = Options.None

    private running: Option<Terminable> = Options.None

    private cancelled: boolean = false

    appendWords(words: string): this {
        return this.appendSentence(new Sentence(words))
    }

    appendSentence(sentence: Sentence): this {
        return this.appendProcess({
            start: (complete: Callback): Terminable => {
                const utterance = sentence.createUtterance()
                utterance.addEventListener('end', complete)
                this.synth.speak(utterance)
                return { terminate: () => this.synth.cancel() }
            }
        })
    }

    appendEvent(callback: Callback): this {
        return this.appendProcess({
            start: (complete: Callback): Terminable => {
                callback()
                complete()
                return TerminableVoid
            }
        })
    }

    appendPause(seconds: number): this {
        return this.appendProcess({
            start: (complete: Callback): Terminable => {
                const id = setTimeout(complete, seconds * 1000)
                return { terminate: () => clearTimeout(id) }
            }
        })
    }

    appendProcess(process: Process): this {
        this.processes.push(process)
        return this
    }

    async start(): Promise<void> {
        console.log('start')
        this.running.ifPresent(() => this.cancel())

        return new Promise<void>((resolve: () => void, reject: () => void) => {
            this.reject = Options.valueOf(reject)

            const processes = this.processes.slice()
            const next = () => {
                if (processes.length > 0) {
                    const process = processes.shift()
                    this.running = Options.valueOf(process.start(() => {
                        if (!this.cancelled) {
                            next()
                        }
                    }))
                } else {
                    resolve()
                }
            }
            next()
        })
    }

    cancel(): void {
        this.cancelled = true
        this.running.ifPresent(terminable => terminable.terminate())
        this.running = Options.None
        this.reject.ifPresent(reject => reject())
        this.reject = Options.None
    }
}