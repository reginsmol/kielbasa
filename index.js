import {stdin, stdout} from 'process';
import readline from 'readline';

function init() {
    console.clear()
    const input = readline.createInterface({
        input: stdin,
        output: stdout,
    });

    const startupMessage = `kielbasa supports the following operators: + - * /`;

    console.log(startupMessage);

    prompt(input);
}

function getSpecialCommands(command) {
    const commands = {
        c: console.clear,
        q: process.exit,
        h: (() => {
            console.log(
                String.raw`c: clears all output and previous commands
q: quits kielbasa
h: help`
            );
        })
    }

    return commands[command];
}

function prompt(input) {
    input.question('> ', (result) => {
        const normalizedResult = result.toLowerCase();

        if (getSpecialCommands(normalizedResult)) {
            getSpecialCommands(normalizedResult)();
        } else {
            console.log(normalizedResult);
        }

        prompt(input);
    });
}

init();