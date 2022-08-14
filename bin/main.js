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
import { Lecture } from './lib/speech.js';
const body = HTML.query('body');
const startButton = HTML.query('button.play');
startButton.addEventListener('click', () => __awaiter(void 0, void 0, void 0, function* () {
    startButton.style.display = 'none';
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
        start: (complete) => Events.bind(window, 'click', () => complete(), { once: true }),
        name: () => 'Please Click!'
    })
        .appendWords('Now I pause for 3 seconds for no reason.')
        .appendPause(3)
        .appendEvent(() => document.body.style.backgroundColor = 'orange')
        .appendWords(`I changed it to orange again, which I like.`)
        .appendBreak()
        .appendWords(`Anyway... Great work! Let's keep in touch!`)
        .appendEvent(() => document.body.style.backgroundColor = 'black');
    const paragraph = HTML.create('p');
    body.appendChild(paragraph);
    lecture.addObserver((event) => {
        if (event.type === 'sentence') {
            paragraph.textContent = event.sentence;
        }
        else if (event.type === 'interaction') {
            paragraph.textContent = event.message;
        }
        else if (event.type === 'pause') {
            paragraph.textContent = `pause for ${event.seconds.toFixed(3)} seconds`;
        }
    });
    yield lecture.start();
    startButton.style.display = 'block';
    paragraph.remove();
    console.log('lecture complete.');
}));
//# sourceMappingURL=main.js.map