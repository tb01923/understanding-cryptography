const {arrayToAlphabetMap } = require('./cipher-helpers/alphabet-map')
const {reduce, pipe, curry, findKeyByValue} = require('../general-helpers/functional-bits')
const {appendToArray, join,  floor_modulo, numberOfKeys, gcd} = require('../general-helpers/common-bits')


// appendToArrayReducer :: ({character: Number} -> Number -> Number -> character -> character) ->
//                                    {character: Number} -> Number -> Number -> Number -> [character] -> character -> [character]
const appendToArrayReducer = curry((algo, alphabetMap, a, b, m, arr, x) =>
    appendToArray(
        arr, algo(alphabetMap, a, b, m, x)
    )
)

// applyWith :: ({character: Number} -> Number -> Number -> character -> character) ->
//                                {character: Number} -> Number -> Number -> Number -> [character] -> [character]
const applyWith = curry((algo, alphabetMap, a, b, m, xs) =>
    reduce(
        appendToArrayReducer(algo, alphabetMap, a, b, m)
        ,[]
        , xs
    )
)

// applyWithAsString :: ({character: Number} -> Number -> Number -> character -> character) ->
//                                {character: Number} -> Number -> Number -> Number -> String -> String
const applyWithAsString = (algo, alphabetMap, a, b, m) => pipe([
    applyWith(algo, alphabetMap, a, b, m),
    join('')
])


const inverse = (m, a, i) => {
    i = i || 1 ;
    if ( (a * i) % m == 1 ) {
        return i
    } 
    return inverse(m, a, i+2)
}

// enryptCharacter  :: {character: Number} -> Number -> Number -> Number -> character -> character
const encryptCharacter = curry((alphabetMap, a, b, m, plainCharacter) => {
    const x = alphabetMap[plainCharacter]
    const y = floor_modulo(a * x + b, m)
    const cipherCharacter = findKeyByValue(alphabetMap, y)
    return cipherCharacter
})

// decryptCharacter  :: {character: Number} -> Number -> Number -> Number -> character -> character
const decryptCharacter = curry((alphabetMap, a, b, m, cipherCharacter) => {
    const y = alphabetMap[cipherCharacter]
    const inv = inverse(m, a)
    const x = floor_modulo(inv * (y - b), m)
    const plainCharacter = findKeyByValue(alphabetMap, x)
    return plainCharacter
})

// shiftCipher :: string, Number, Number -> { encrypt :: string -> string, decrypt :: string -> string }
const affineCipher = (alphabet, a, b) => {
    const alphabetArray = alphabet.split('')
    const alphabetMap = arrayToAlphabetMap(alphabetArray)
    const m = numberOfKeys(alphabetMap)

    if( gcd(a, m) != 1 ){
        throw Error('"a" (' + a + ') must be coprime to the length of the alphabet specified (' + m +  ')')
    }

    return {
        encrypt: applyWithAsString(encryptCharacter, alphabetMap, a, b, m),
        decrypt: applyWithAsString(decryptCharacter, alphabetMap, a, b, m),
    }
}

module.exports = {
    affineCipher,
    encryptCharacter,
    decryptCharacter
}