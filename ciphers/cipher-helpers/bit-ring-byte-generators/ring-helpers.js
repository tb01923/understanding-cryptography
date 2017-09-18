const { pipe, map } = require('../../../general-helpers/functional-bits')
const { arrayOf, parseIntBinary, join } = require('../../../general-helpers/common-bits')

// getNextByte
//  given a number of bits, generate and return a Number of that number of bits
// getNextByte :: (() -> Bit) -> Number -> Number
const getNextByte = generateBit => pipe([
    // Number -> [null]
    arrayOf(null),
    // [a] -> [Bit]
    map(generateBit),
    // [Bit] -> String
    join(''),
    // String -> Number
    parseIntBinary
])

module.exports = {
    getNextByte
}
