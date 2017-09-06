const tapLookup = require('./lfsr-taps')
const { reduce, map, curry, pipe } = require('../general-helpers/functional-bits')
const { arrayOf, parseIntBinary, clone, join } = require('../general-helpers/common-bits')

const xor = (a,b) => a ^ b

const removeLeft = arr => {
    const c = clone(arr)
    const x = c.shift()
    return {output: x, array: c}
}
const removeRight = arr => {
    const c = clone(arr)
    const x = c.pop()
    return {output: x, array: c}
}
const appendRight = curry((arr, x) => {
    const c = clone(arr)
    c.push(x)
    return c
})
const appendLeft = curry((arr, x) => {
    const c = clone(arr)
    c.unshift(x)
    return c
})

const LEFT_TO_RIGHT = 'LEFT_TO_RIGHT'
const RIGHT_TO_LEFT = 'RIGHT_TO_LEFT'

// getDirectionalFunctions ::
//      String, Number ->  {append: ([x] -> x -> [x]), remove: ([x] -> {[x], x}), tapIndexMapper: (Number -> Number)}
const getDirectionalFunctions = (direction, n) => {
    const subtractOne = x => x - 1
    const subtractFromN = x => n - x
    const append = (direction == LEFT_TO_RIGHT) ? appendLeft  : appendRight ;
    const remove = (direction == LEFT_TO_RIGHT) ? removeRight  : removeLeft ;
    const tapIndexMapper = (direction == LEFT_TO_RIGHT) ? subtractOne : subtractFromN ;

    return {
      append, remove, tapIndexMapper
    }
}

// calculateNewBit
//  calculate the feedback bit, input is an array of tap indexes, and an array of bits to tap
//  the calculation is an XOR of all bits at the tap points (indexes).
//
// calculateNewBit :: [Number] -> [Bits] -> Bit
const calculateNewBit = (taps, register) =>
    reduce(
        (tap1, tap2) => xor(register[tap1], register[tap2]),
        taps[0],
        taps.slice(1)
    )

// shifter
//  shifts the bits outputting the next bit out in the register THEN calculating a new bit and feeding
//  it back to the other side of the register (the input and output sides are dependent on the input functions /
//  direction)
//
// shifter :: ( ([x] -> x -> [x]), ([x] -> {[x], x}), [Number] ) ->  [Bit] -> {newRegister: [x], output: x}
const shifter = (append, remove,  taps) =>
    register => {
        const feedbackBit = calculateNewBit(taps, register)
        const appendedRegister = append(register, feedbackBit)
        const { output, array } = remove(appendedRegister)

        return { newRegister: array, output: output }
    }

// buildShifter
//  direction determines which appender and removers to use, as well as how to adjust the indexes of the taps. a
//  right to left register (bits exit register[0] and feedback at register[n]) makes more sense to me,
//  but there are other online examples that take the opposite approach, so being able to switch - may make
//  comparing the two implementations easier.
//
// buildShifter :: String, {Number, [Number]}  -> ([Bit] -> {[x], x})
const buildShifter = (direction, {n, taps}) => {

    const { append, remove, tapIndexMapper } = getDirectionalFunctions(direction, n)
    const tapIndexes = map(tapIndexMapper, taps)

    return shifter(append, remove, tapIndexes)
}

// getNextByte
//  given a number of bits, generate and return a Number of that number of bits
// getNextByte :: Number -> Number
const getNextByte = generateBits => pipe([
    arrayOf,
    map(generateBits),
    join(''),
    parseIntBinary
])

const ExternalLfsrByteRing = function *(byteLength, initialRegisterBitArray) {
    const n = initialRegisterBitArray.length

    // shift :: [Bit] -> {newRegister: [x], output: x}
    const shift = buildShifter(LEFT_TO_RIGHT, tapLookup[n])

    // register is an array representing the current state of bits
    let register = initialRegisterBitArray ;

    // shiftRegister
    //  shifts the bits in the register
    //  ** CAUTION: MUTATES register **
    // shiftRegister :: unit -> Bit
    const shiftRegister = () => {
        const {newRegister, output} = shift(register)
        // side-effect here
        register = newRegister
        return output
    }

    // return a byte whenever asked
    while(true) {
        yield getNextByte(shiftRegister)(byteLength)
    }
}

module.exports = {
    ExternalLfsrByteRing
}