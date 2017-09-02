const {reduce, pipe} = require('../../general-helpers/functional-bits')
const {maxOr, increment, appendToObj, values} = require('../../general-helpers/common-bits')

const maxOrNegOne = maxOr(-1)


const englishAlphabet = 'abcdefghijklmnopqrstuvwxyz'

// getNextValue :: {character: Number} -> Number
const getNextValue = pipe([
    values,
    maxOrNegOne,
    increment
])

// arrayToAlphabetMap :: [k] -> {k: Number}
const arrayToAlphabetMap = (arr) => reduce(
    (map, a) =>appendToObj(map, a, getNextValue(map)),
    {},
    arr
)

module.exports = {
    englishAlphabet,
    arrayToAlphabetMap,
    getNextValue
}