# Speech Scheduler
A simple speech scheduler for writing spoken, interactive tutorials.

### Example
```
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
        
await lecture.start()
```

[Open in browser...](https://andremichelle.github.io/speech-scheduler/)

# Deploy
Make sure to have sass installed and run in the console:

    sass sass/main.sass:bin/main.css --watch

Make sure to have typescript installed and run in the console:

    tsc -p ./typescript/tsconfig.json --watch
