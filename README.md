# kielbasa
kielbasa is a dependency free Reverse Polish Notation calculator written in JavaScript. 

To run the code simply run `npm start`

To run the tests first run `npm install` then `npm test`
## Methodology
While working on this RPN calculator I wanted to challenge myself to make it completely free of dependencies (save for mocha as a test runner and sinon for spying/stubbing function calls). Requiring only a single command to run the application.

I really tried to lean into JavaScript's functional nature to make adding new operations and commands as easy as possible and to keep the code as clean and minimal as I could. I tried to adhere to the KISS principle as to not overcomplicate or overengineer it while also allowing for the possibility of additional room to expand the application.

I used a simple stack datatype for storing the operations similar to the first computer implementations of the notation

I used recursion to minimize the amount of overall code needed. The `handleInput()` function will handle both operations given on a single line e.g. `5 5 5 8 + + -` and operations given sequentially. This allowed me to have on function handle both scenarios based on context requiring only a single function.

## Tradeoffs
Had I had more time I would've come up with a better way of storing the operations rather than a global variable, given the time and scope I think this approach was sufficient.
I could have made the `handleInput()` function cleaner and try to avoid validating the inputs twice and not have as much logic branching.
Deciding to not use any dependencies added a few obstacles, primarily surrounding not having any type of transpiler which made testing a bit more difficult and requiring the use of ES5 modules as opposed to ES6.

Also given more time I would've had more thorough test coverage.