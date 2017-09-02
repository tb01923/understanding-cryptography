const {arrayToAlphabetMap } = require('./cipher-helpers/alphabet-map')
const {reduce, pipe, curry, findKeyByValue} = require('../general-helpers/functional-bits')
const {appendToArray, join,  floor_modulo, numberOfKeys } = require('../general-helpers/common-bits')


// appendToArrayReducer :: ({character: Number} -> Number -> Number -> character -> character) ->
//                                    {character: Number} -> Number -> Number -> [character] -> character -> [character]
const appendToArrayReducer = curry((algo, alphabetMap, k, m, arr, x) =>
    appendToArray(
        arr, algo(alphabetMap, k, m, x)
    )
)

// applyWith :: ({character: Number} -> Number -> Number -> character -> character) ->
//                                {character: Number} -> Number -> Number -> [character] -> [character]
const applyWith = curry((algo, alphabetMap, k, m, xs) =>
    reduce(
        appendToArrayReducer(algo, alphabetMap, k, m)
        ,[]
        , xs
    )
)

// applyWith :: ({character: Number} -> Number -> Number -> character -> character) ->
//                                {character: Number} -> Number -> Number -> String -> String
const applyWithAsString = (algo, alphabetMap, k, m) => pipe([
    applyWith(algo, alphabetMap, k, m),
    join
])

// enryptCharacter  :: {character: Number} -> Number -> Number -> character -> character
const encryptCharacter = curry((alphabetMap, k, m, plainCharacter) => {
    const x = alphabetMap[plainCharacter]
    const y = floor_modulo(x + k, m)
    const cipherCharacter = findKeyByValue(alphabetMap, y)
    return cipherCharacter
})

// decryptCharacter  :: {character: Number} -> Number -> Number -> character -> character
const decryptCharacter = curry((alphabetMap, k, m, cipherCharacter) => {
    const y = alphabetMap[cipherCharacter]
    const x = floor_modulo(y - k, m)
    const plainCharacter = findKeyByValue(alphabetMap, x)
    return plainCharacter
})

// shiftCipher :: string, Number -> { encrypt :: string -> string, decrypt :: string -> string }
const shiftCipher = (alphabet, k) => {
    const alphabetArray = alphabet.split('')
    const alphabetMap = arrayToAlphabetMap(alphabetArray)
    const m = numberOfKeys(alphabetMap)



    return {
        encrypt: applyWithAsString(encryptCharacter, alphabetMap, k, m),
        decrypt: applyWithAsString(decryptCharacter, alphabetMap, k, m),
    }
}

module.exports = {
    shiftCipher,
    encryptCharacter,
    decryptCharacter
}