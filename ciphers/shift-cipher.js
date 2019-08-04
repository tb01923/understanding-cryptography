const {arrayToAlphabetMap } = require('./cipher-helpers/alphabet-map')
const {pipe, curry, map, findKeyByValue} = require('../general-helpers/functional-bits')
const {join,  floor_modulo, numberOfKeys } = require('../general-helpers/common-bits')

const applyAlgoToString = algo => pipe([
    map(algo),
    join('')
])

// enryptCharacter  :: {character: Number} -> Number -> Number -> character -> character
const encryptCharacter = curry((alphabetMap, k, plainCharacter) => {
    const alphabetLength = numberOfKeys(alphabetMap)
    const x = alphabetMap[plainCharacter]
    const y = floor_modulo(x + k, alphabetLength)
    const cipherCharacter = findKeyByValue(alphabetMap, y)
    return cipherCharacter
})

// decryptCharacter  :: {character: Number} -> Number -> Number -> character -> character
const decryptCharacter = curry((alphabetMap, k, cipherCharacter) => {
    const alphabetLength = numberOfKeys(alphabetMap)
    const y = alphabetMap[cipherCharacter]
    const x = floor_modulo(y - k, alphabetLength)
    const plainCharacter = findKeyByValue(alphabetMap, x)
    return plainCharacter
})

// shiftCipher :: string, Number -> { encrypt :: string -> string, decrypt :: string -> string }
const shiftCipher = (alphabet, k) => {
    const alphabetArray = alphabet.split('')
    const alphabetMap = arrayToAlphabetMap(alphabetArray)

    const encryptString = applyAlgoToString(encryptCharacter(alphabetMap, k))
    const decryptString = applyAlgoToString(decryptCharacter(alphabetMap, k))

    return {
        encrypt: encryptString,
        decrypt: decryptString
    }
}

module.exports = {
    shiftCipher,
    encryptCharacter,
    decryptCharacter
}