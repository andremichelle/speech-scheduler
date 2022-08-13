import { Events, Terminable } from './lib/common.js'
import { HTML } from './lib/dom.js'
import { Lecture, LectureEvent, Sentence } from './speech.js'

const body: HTMLBodyElement = HTML.query('body')
const startButton: HTMLElement = HTML.query('button.play')
startButton.addEventListener('click', async () => {
    startButton.style.display = 'none'
    const lecture = new Lecture()
        .appendSentence(new Sentence()
            .appendWords('Welcome to this color lecture.')
            .appendEvent(() => document.body.style.backgroundColor = 'green')
            .appendWords('Green!')
            .appendEvent(() => document.body.style.backgroundColor = 'yellow')
            .appendWords('Yellow...')
            .appendEvent(() => document.body.style.backgroundColor = 'orange')
            .appendWords('Orange?')
            .appendEvent(() => document.body.style.backgroundColor = 'black')
            .appendWords('Black it is.'))
        .appendWords('Now I wait for you to click...')
        .appendInteraction({
            start: (complete: CallableFunction): Terminable =>
                Events.bind(window, 'click', () => complete(), { once: true }),
            name: () => 'Please Click!'
        })
        .appendWords('Now I pause for 3 seconds for no reason...')
        .appendPause(3)
        .appendEvent(() => document.body.style.backgroundColor = 'orange')
        .appendWords(`I changed it to orange again, which I like.`)
        .appendWords(`Anyway... Great work! Let's keep in touch!`)

    // setTimeout(() => lecture.cancel(), 2000) will reject the promise!

    const paragraph = HTML.create('p')
    body.appendChild(paragraph)

    lecture.addObserver((event: LectureEvent) => {
        while (paragraph.lastChild !== null) {
            paragraph.lastChild.remove()
        }

        if (event.type === 'sentence') {
            const c0 = event.sentence.substring(0, event.charStart)
            const c1 = event.sentence.substring(event.charStart, event.charEnd)
            const c2 = event.sentence.substring(event.charEnd)

            paragraph.appendChild(HTML.create('span', { textContent: c0 }))
            paragraph.appendChild(HTML.create('span', { textContent: c1, class: 'highlight' }))
            paragraph.appendChild(HTML.create('span', { textContent: c2 }))
        } else if (event.type === 'interaction') {
            paragraph.appendChild(HTML.create('span', { textContent: event.message, class: 'highlight' }))
        }
    })

    await lecture.start()

    startButton.style.display = 'block'
    paragraph.remove()
    console.log('lecture complete.')
})