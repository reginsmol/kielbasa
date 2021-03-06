const readline = require('readline')
const {stdin, stdout} = require('process')

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

    const startupMessage = `kielbasa supports the following operators: + - * / ^`;

    console.log(startupMessage);
    module.exports.prompt(input);
}

/**
 * Prompts the user for input, passing off input to be handled and restarting the flow over
 * @param input
 */
function prompt(input) {
    input.question('> ', (result) => {
        module.exports.handleInput(result)
        module.exports.prompt(input)
    });
}

/**
 * Returns a callback for specific non-arithmetic based commands
 * @param command
 * @returns {*}
 */
function getSpecialCommands(command) {
    const commands = {
        c: () => {
            stack.length = 0;
            console.clear()
        },
        q: process.exit,
        s: () => {
            console.log(stack.join(' '))
        },
        h: () => {
            console.log(
                String.raw`kielbasa is an RPN calculator that accepts the following operators: + - * / ^
Commands:                
c - clears all output and previous commands
q - quits kielbasa
h - help
s - prints the stack to the console`
            );
        }

    }

    return commands[command];
}

/**
 * Looks for a specific operator
 * @param operator
 * @returns {string}
 */
function getOperator(operator) {
    let operators = {
        '+': add,
        '-': subtract,
        '*': multiply,
        '/': divide,
        '^': exponent
    }

    return operators[operator]
}

function add(a, b) {
    return a + b;
}

function subtract(a, b) {
    return a - b;
}

function multiply(a, b) {
    return a * b;
}

function divide(a, b) {
    return a / b;
}

function exponent(a, b) {
    return a ** b;
}

/**
 * Looks for and calls callbacks for special commands
 * @param input
 */
function handleSpecialCommands(input) {
    const normalizedResult = input.toLowerCase();

    if (module.exports.getSpecialCommands(normalizedResult)) {
        module.exports.getSpecialCommands(normalizedResult)();
    }
}

/**
 * Handle the incoming values and delegate the behaviors accordingly
 * @param input
 */
function handleInput(input) {
    if (input.indexOf(' ') > -1) {
        const split = input.split(' ')

        split.forEach(item => {
            // This isn't ideal, because we end up validating twice but its better than nuking the runtime with infinite recursion ??\_(???)_/??
            if (module.exports.numberValidator(item) || module.exports.getOperator(item) || module.exports.getSpecialCommands(item)) {
                module.exports.handleInput(item)
            }
        })
    } else {
        if (module.exports.getSpecialCommands(input)) {
            module.exports.handleSpecialCommands(input)
        } else if (numberValidator(input)) {
            module.exports.stack.push(parseInt(input));
        } else if (getOperator(input)) {
            module.exports.evaluate(input)
        } else {
            console.log(`Invalid input: ${input}`)
        }
    }
}

/**
 * Evaluate the expression applying the arithmetic to the last 2 indexes of the stack, removing them, then pushing the result.
 * @param operator
 */
function evaluate(operator) {
    if (stack.length >= 2) {
        let a = stack[stack.length - 2];
        let b = stack[stack.length - 1];
        let result = getOperator(operator)(a, b);

        stack.splice(stack.length - 2, 2);

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
    return !isNaN(parsedInt) && (Math.abs(parsedInt) <= Number.MAX_SAFE_INTEGER);
}

module.exports = {
    init,
    prompt,
    numberValidator,
    handleInput,
    getSpecialCommands,
    getOperator,
    handleSpecialCommands,
    evaluate,
    stack,
}