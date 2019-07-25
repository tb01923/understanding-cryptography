const {arrayToAlphabetMap } = require('./cipher-helpers/alphabet-map')
const {reduce, pipe, curry, findKeyByValue} = require('../general-helpers/functional-bits')
const {appendToArray, join,  floor_modulo, numberOfKeys } = require('../general-helpers/common-bits')


// appendToArrayReducer :: ({character: Number} -> Number -> character -> character) ->
//                                    {character: Number} -> Number -> [character] -> character -> [character]
const appendToArrayReducer = curry((algo, alphabetMap, k, arr, x) =>
    appendToArray(
        arr, algo(alphabetMap, k, x)
    )
)

// applyWith :: ({character: Number} -> Number -> character -> character) ->
//                                {character: Number} -> Number -> [character] -> [character]
const applyWith = curry((algo, alphabetMap, k, xs) =>
    reduce(
        appendToArrayReducer(algo, alphabetMap, k)
        ,[]
        , xs
    )
)

// applyWith :: ({character: Number} -> Number -> character -> character) ->
//                                {character: Number} -> Number -> String -> String
const applyWithAsString = (algo, alphabetMap, k) => pipe([
    applyWith(algo, alphabetMap, k),
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

    return {
        encrypt: applyWithAsString(encryptCharacter, alphabetMap, k),
        decrypt: applyWithAsString(decryptCharacter, alphabetMap, k),
    }
}

module.exports = {
    shiftCipher,
    encryptCharacter,
    decryptCharacter
}