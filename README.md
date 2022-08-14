# Speech Scheduler
A simple speech scheduler for writing spoken, interactive tutorials.

### Example
```
const lecture = new Lecture()
        .appendWords('Welcome to this imaginary color lecture.')
        .appendBreak()
        .appendWords('This is ')
        .appendEvent(() => document.body.style.backgroundColor = 'green')
        .appendWords('Green!')
        .appendWords('This is ')
        .appendEvent(() => document.body.style.backgroundColor = 'yellow')
        .appendWords('Yellow...')
        .appendWords('This is ')
        .appendEvent(() => document.body.style.backgroundColor = 'orange')
        .appendWords('Orange?')
        .appendWords('This is ')
        .appendEvent(() => document.body.style.backgroundColor = 'black')
        .appendWords('Black.')
        .appendWords('Now I wait for you to click...')
        .awaitInteraction({
            start: (complete: CallableFunction): Terminable =>
                Events.bind(window, 'click', () => complete(), { once: true }),
            name: () => 'Please Click!'
        })
        .appendWords('Now I pause for 3 seconds for no reason...')
        .appendPause(3)
        .appendEvent(() => document.body.style.backgroundColor = 'orange')
        .appendWords(`I changed it to orange again, which I like.`)
        .appendBreak()
        .appendWords(`Anyway... Great work! Let's keep in touch!`)
        .appendEvent(() => document.body.style.backgroundColor = 'black')
await lecture.start()
```

[Open in browser...](https://andremichelle.github.io/speech-scheduler/)

# Deploy
Make sure to have sass installed and run in the console:

    sass sass/main.sass:bin/main.css --watch

Make sure to have typescript installed and run in the console:

    tsc -p ./typescript/tsconfig.json --watch
