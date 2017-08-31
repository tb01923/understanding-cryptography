const {arrayToAlphabetMap } = require('./alphabet-map')
const {reduce, pipe, curry, findKeyByValue, map} = require('../helpers/functional-bits')
const {split, appendToArray, join,  floor_modulo, numberOfKeys } = require('../helpers/common-bits')

// xor :: Number, Number -> Number
const xor = (a,b) => (!a != !b) ? 1 : 0

const stringToBitArray = pipe([
    split,
    map(parseInt)
])

// encryptCharacter  ::
const encryptCharacter = curry((keyStream, plainCharacter) => {
    const x = alphabetMap[plainCharacter]
    const y = floor_modulo(x + k, m)
    const cipherCharacter = findKeyByValue(alphabetMap, y)
    return cipherCharacter
})

// decryptCharacter  ::
const decryptCharacter = curry((keyStream, cipherCharacter) => {
    const y = alphabetMap[cipherCharacter]
    const x = floor_modulo(y - k, m)
    const plainCharacter = findKeyByValue(alphabetMap, x)
    return plainCharacter
})

// blockCipher ::
const blockCipher = (keyStream) => {

    return {
        encrypt: applyWithAsString(encryptCharacter, keyStream),
        decrypt: applyWithAsString(decryptCharacter, keyStream),
    }
}

module.exports = {
    blockCipher,
    encryptCharacter,
    decryptCharacter,
    xor,
    stringToBitArray
}