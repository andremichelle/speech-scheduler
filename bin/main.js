var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Events } from './lib/common.js';
import { HTML } from './lib/dom.js';
import { Lecture, Sentence } from './speech.js';
const body = HTML.query('body');
const startButton = HTML.query('button.play');
startButton.addEventListener('click', () => __awaiter(void 0, void 0, void 0, function* () {
    startButton.style.display = 'none';
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
        start: (complete) => Events.bind(window, 'click', () => complete(), { once: true }),
        name: () => 'Please Click!'
    })
        .appendWords('Now I pause for 3 seconds for no reason...')
        .appendPause(3)
        .appendEvent(() => document.body.style.backgroundColor = 'orange')
        .appendWords(`I changed it to orange again, which I like.`)
        .appendWords(`Anyway... Great work! Let's keep in touch!`);
    const paragraph = HTML.create('p');
    body.appendChild(paragraph);
    lecture.addObserver((event) => {
        while (paragraph.lastChild !== null) {
            paragraph.lastChild.remove();
        }
        if (event.type === 'sentence') {
            const c0 = event.sentence.substring(0, event.charStart);
            const c1 = event.sentence.substring(event.charStart, event.charEnd);
            const c2 = event.sentence.substring(event.charEnd);
            paragraph.appendChild(HTML.create('span', { textContent: c0 }));
            paragraph.appendChild(HTML.create('span', { textContent: c1, class: 'highlight' }));
            paragraph.appendChild(HTML.create('span', { textContent: c2 }));
        }
        else if (event.type === 'interaction') {
            paragraph.appendChild(HTML.create('span', { textContent: event.message, class: 'highlight' }));
        }
    });
    yield lecture.start();
    startButton.style.display = 'block';
    paragraph.remove();
    console.log('lecture complete.');
}));
//# sourceMappingURL=main.js.map