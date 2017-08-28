const {reduce, pipe, curry, find} = require('../helpers/functional-bits')
const {maxOr, increment, appendToObj, appendToArray, join, length,
    floor_modulo, numberOfKeys, values} = require('../helpers/common-bits')

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

// enryptCharacter  :: ({character: Number} -> Number -> Number -> character -> character) ->
//                                          {character: Number} -> Number -> Number -> [character] -> [character]
const applyWith = curry((algo, alphabetMap, k, m, xs) =>
    reduce(
        (arr, x) => appendToArray(
        arr, algo(alphabetMap, k, m, x))
        ,[]
        , xs
    )
)

// enryptCharacter  :: {character: Number} -> Number -> Number -> character -> character
const encryptCharacter = curry((alphabetMap, k, m, x) => {
    const rawValue = alphabetMap[x]
    const shiftValue = floor_modulo((rawValue + k), m)
    const shiftCharacter = find(alphabetMap, shiftValue)
    return shiftCharacter
})

// decryptCharacter  :: {character: Number} -> Number -> Number -> character -> character
const decryptCharacter = curry((alphabetMap, k, m, x) => {
    const shiftValue = alphabetMap[x]
    const rawValue = floor_modulo((shiftValue - k), m)
    const rawCharacter = find(alphabetMap, rawValue)
    return rawCharacter
})

// shiftCipher :: string, Number -> { encrypt :: string -> string, decrypt :: string -> string }
const shiftCipher = (alphabet, k) => {
    const alphabetArray = alphabet.split('')
    const alphabetMap = arrayToAlphabetMap(alphabetArray)
    const m = numberOfKeys(alphabetMap)

    return {
        encrypt: pipe([
            applyWith(encryptCharacter, alphabetMap, k, m),
            join
        ]),
        decrypt: pipe([
            applyWith(decryptCharacter, alphabetMap, k, m),
            join
        ]),
    }
}

const raw = 'attack'
const cipher = shiftCipher(alphabet, 17)
const secret = cipher.encrypt(raw)
const raw2 = cipher.decrypt(secret)
console.log(raw, secret, raw2)