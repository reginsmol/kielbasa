import {stdin, stdout} from 'process';
import readline from 'readline';

const stack = [];

/**
 * Initializes the application setting up the stdin/stdout and prompting the user
 */
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

/**
 * Returns a callback for specific non-arithmetic based commands
 * @param command
 * @returns {*}
 */
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

/**
 * Prompts the user for input, passing off input to be handled and restarting the flow over
 * @param input
 */
function prompt(input) {
    input.question('> ', (result) => {
        handleInput(result)
        prompt(input)
    });
}

/**
 * Looks for a specific operator
 * @param operator
 * @returns {string}
 */
function getOperator(operator) {
    return ['+', '-', '*', '/'].find(o => o === operator);
}

/**
 * Looks for and calls callbacks for special commands
 * @param input
 */
function handleSpecialCommands(input) {
    const normalizedResult = input.toLowerCase();

    if (getSpecialCommands(normalizedResult)) {
        getSpecialCommands(normalizedResult)();
    } else {
        handleInput(normalizedResult)
    }
}

/**
 * Handle the incoming values and delegate the behaviors accordingly
 * @param input
 */
function handleInput(input) {
    if(getSpecialCommands(input)) {
        handleSpecialCommands(input)
    } else if(numberValidator(input)) {
        console.log(input)
        stack.push(parseInt(input));
    } else if(getOperator(input)) {
        evaluate(input)
    }

}

function evaluate(operator) {
    if(stack.length >= 2) {
        let a = stack[0];
        let b = stack[1];
        let result = eval(`${a}${operator}${b}`)
        stack.shift()
        stack.shift()
        stack.push(result)
        console.log(result)
    }
}

/**
 * Ensure we're actually dealing with a number and that it is within reasonable bounds for getting accurate calculations
 * @param input
 * @returns {boolean}
 */
function numberValidator(input) {
    const parsedInt = parseInt(input);
    return !isNaN(parsedInt) && (parsedInt >= Number.MIN_SAFE_INTEGER && parsedInt <= Number.MAX_SAFE_INTEGER);
}

init();