import { Events, Terminable } from './lib/common.js'
import { HTML } from './lib/dom.js'
import { Lecture, Sentence } from './speech.js'

const startButton: HTMLElement = HTML.query('button.play')
startButton.addEventListener('click', async () => {
    startButton.style.display = 'none'
    const lecture = new Lecture()
        .appendSentence(new Sentence('Welcome to this lecture.')
            .appendEvent(() => document.body.style.backgroundColor = 'green')
            .appendWords('Green!')
            .appendEvent(() => document.body.style.backgroundColor = 'yellow')
            .appendWords('Yellow...')
            .appendEvent(() => document.body.style.backgroundColor = 'orange')
            .appendWords('Orange?')
            .appendEvent(() => document.body.style.backgroundColor = 'black')
            .appendWords('Black it is.'))
        .appendWords('Now I wait for you to click...')
        .appendProcess({ start: (complete: CallableFunction): Terminable => Events.bind(window, 'click', () => complete()) })
        .appendWords('Now I pause for 1 second for no reason...')
        .appendPause(1)
        .appendEvent(() => document.body.style.backgroundColor = 'orange')
        .appendWords(`Uh. I changed it to orange again, which I like.`)
        .appendWords(`Anyway... Great work! Let's keep in touch!`)

    // setTimeout(() => lecture.cancel(), 2000) will reject the promise!

    await lecture.start()

    startButton.style.display = 'block'
    console.log('lecture complete.')
})