const readline = require("readline");
const sinon = require('sinon')

const assert = require('assert')

describe('kielbasa', () => {
    let sandbox;

    beforeEach(() => {
        sandbox = sinon.createSandbox()
    })

    afterEach(function () {
        sinon.restore()
    })

    describe('init()', () => {
        after(() => {
            sandbox.restore()
        })
        it('should boot the application calling the correct functions', () => {
            const functions = require('../lib/functions')
            let promptStub = sandbox.stub(functions, 'prompt');
            let consoleLogStub = sandbox.stub(console, 'log')
            let consoleClearStub = sandbox.stub(console, 'clear')
            let createInterfaceStub = sandbox.stub(readline, 'createInterface')

            functions.init()

            sinon.assert.calledOnce(promptStub);
            sinon.assert.calledOnce(consoleLogStub)
            sinon.assert.calledOnce(consoleClearStub)
            sinon.assert.calledOnce(createInterfaceStub)
        })
    });

    describe('prompt()', () => {
        afterEach(() => {
            sandbox.restore()
        })
        it('should call input.question, handleInput, and prompt recursively', () => {
            const functions = require('../lib/functions')

            const promptSpy = sandbox.spy(functions, 'prompt')
            const handleInputStub = sandbox.stub(functions, 'handleInput');

            const input = {
                question: sinon.stub().onFirstCall().callsArgWith(1, 'foobar')//.onSecondCall().callsArgWith(1, null)
            }

            functions.prompt(input);

            sandbox.assert.calledOnce(handleInputStub);
            assert.equal(input.question.args[0][0], '> ')
            assert.equal(typeof input.question.args[0][1], 'function')

            assert.deepEqual(promptSpy.args[0][0], input)

            sandbox.assert.calledTwice(input.question);
        })
    })

    describe('getSpecialCommands()', () => {
        const {getSpecialCommands} = require ('../lib/functions');
        ['c', 'q', 's', 'h'].forEach(command => {
            it(`should return the function for the given command: ${command}`, function () {
                assert.equal(typeof getSpecialCommands(command), 'function')
            });
        })

        it('should return null for an invalid command', () => {
            assert.equal(getSpecialCommands('foo'), null)
        })
    });

    describe('handleSpecialCommands()', () => {
        afterEach(() => {
            sandbox.restore()
        })
        const {handleSpecialCommands} = require('../lib/functions');

        it('should call the callback for a valid special command', () => {
            const functions = require('../lib/functions');

            const callbackStub = sandbox.stub();
            const getSpecialCommandsStub = sandbox.stub(functions, 'getSpecialCommands').returns(callbackStub)

            handleSpecialCommands('foo')
            sandbox.assert.calledTwice(getSpecialCommandsStub)
           sandbox.assert.calledOnce(callbackStub)
        })

        it('should not call the callback for an invalid special command', function () {
            const functions = require('../lib/functions');

            const callbackStub = sandbox.stub();
            const getSpecialCommandsStub = sandbox.stub(functions, 'getSpecialCommands').returns(null)

            handleSpecialCommands('foo')
            sandbox.assert.calledOnce(getSpecialCommandsStub)
        });
    })

    describe('handleInput()', () => {
        afterEach(() => {
            sandbox.restore()
        })

        it('should be able to evaluate a string of operators & operands on a single line', function () {
            const functions = require('../lib/functions')

            const handleInputSpy = sandbox.spy(functions, 'handleInput');
            const evaluateStub = sandbox.stub(functions, 'evaluate');
            const handleSpecialCommandsStub = sandbox.stub(functions, 'handleSpecialCommands')

            functions.handleInput('1 2 3 +')

            sandbox.assert.callCount(handleInputSpy, 5)
            sandbox.assert.calledOnce(evaluateStub)
            sandbox.assert.notCalled(handleSpecialCommandsStub)
        });
    })

    describe('getOperator()', () => {
        const {getOperator} = require('../lib/functions');
        ['+', '-', '/', '^'].forEach(command => {
            it(`should return the operators function for the given operator: ${command}`, function () {
                assert.equal(typeof getOperator(command), 'function')
            });
        })
    });

    describe('numberValidator()', () => {
        const {numberValidator} = require ('./../lib/functions')
        it('should return true for all valid numbers', () => {
            assert.equal(numberValidator(1), true)
            assert.equal(numberValidator(-1), true)
            assert.equal(numberValidator(Number.MAX_SAFE_INTEGER), true)
            assert.equal(numberValidator(Number.MIN_SAFE_INTEGER), true)
            assert.equal(numberValidator(3.14), true)
            assert.equal(numberValidator(0x1000), true)
            assert.equal(numberValidator('100'), true);
        });

        it('should return false for non numeric values', () => {
            assert.equal(numberValidator('foobar'), false)
            assert.equal(numberValidator(true), false)
            assert.equal(numberValidator(Number.MAX_SAFE_INTEGER + 10), false)
            assert.equal(numberValidator(Number.MIN_SAFE_INTEGER - 10), false)

        });
    })
})
