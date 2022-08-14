import { Events, Terminable } from './lib/common.js'
import { HTML } from './lib/dom.js'
import { Lecture, LectureEvent } from './lib/speech.js'

const body: HTMLBodyElement = HTML.query('body')
const startButton: HTMLElement = HTML.query('button.play')
startButton.addEventListener('click', async () => {
    startButton.style.display = 'none'
    const lecture = new Lecture()
        .appendWords('Welcome to this imaginary color lecture.')
        .appendBreak()
        .appendWords('This is')
        .appendEvent(() => document.body.style.backgroundColor = 'green')
        .appendWords('Green!')
        .appendBreak()
        .appendWords('This is')
        .appendEvent(() => document.body.style.backgroundColor = 'yellow')
        .appendWords('Yellow...')
        .appendBreak()
        .appendWords('This is')
        .appendEvent(() => document.body.style.backgroundColor = 'orange')
        .appendWords('Orange?')
        .appendBreak()
        .appendWords('This is')
        .appendEvent(() => document.body.style.backgroundColor = 'black')
        .appendWords('Black.')
        .appendBreak()
        .appendWords('Now I wait for you to click...')
        .awaitInteraction({
            start: (complete: CallableFunction): Terminable =>
                Events.bind(window, 'click', () => complete(), { once: true }),
            name: () => 'Please Click!'
        })
        .appendWords('Now I pause for 3 seconds for no reason.')
        .appendPause(3)
        .appendEvent(() => document.body.style.backgroundColor = 'orange')
        .appendWords(`I changed it to orange again, which I like.`)
        .appendBreak()
        .appendWords(`Anyway... Great work! Let's keep in touch!`)
        .appendEvent(() => document.body.style.backgroundColor = 'black')

    // setTimeout(() => lecture.cancel(), 2000) will reject the promise!

    const paragraph = HTML.create('p')
    body.appendChild(paragraph)

    lecture.addObserver((event: LectureEvent) => {
        if (event.type === 'sentence') {
            paragraph.textContent = event.sentence
        } else if (event.type === 'interaction') {
            paragraph.textContent = event.message
        } else if (event.type === 'pause') {
            paragraph.textContent = `pause for ${event.seconds.toFixed(3)} seconds`
        }
    })

    await lecture.start()

    startButton.style.display = 'block'
    paragraph.remove()
    console.log('lecture complete.')
})