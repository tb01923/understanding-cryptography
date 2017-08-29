const {reduce, pipe, curry, find} = require('../helpers/functional-bits')
const {maxOr, increment, appendToObj, appendToArray, join, length,
    floor_modulo, numberOfKeys, values, gcd} = require('../helpers/common-bits')

const maxOrNegOne = maxOr(-1)

const alphabet = 'abcdefghijklmnopqrstuvwxyz'

// arrayToAlphabetMap :: [k] -> {k: Number}
const arrayToAlphabetMap = reduce(
    (map, a) => appendToObj(map, a, getNextValue(map)),
    {}
)

// getNextValue :: {character: Number} -> Number
const getNextValue = pipe([
    values,
    maxOrNegOne,
    increment
])

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
    join
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
    const cipherCharacter = find(alphabetMap, y)
    return cipherCharacter
})

// decryptCharacter  :: {character: Number} -> Number -> Number -> Number -> character -> character
const decryptCharacter = curry((alphabetMap, a, b, m, cipherCharacter) => {
    const y = alphabetMap[cipherCharacter]
    const inv = inverse(m, a)
    const x = floor_modulo(inv * (y - b), m)
    const plainCharacter = find(alphabetMap, x)
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

const raw = 'AFFINE CIPHER'.toLowerCase()
const cipher = affineCipher(alphabet, 2, 8)
const secret = cipher.encrypt(raw)
const raw2 = cipher.decrypt(secret)
console.log(raw, secret, raw2)