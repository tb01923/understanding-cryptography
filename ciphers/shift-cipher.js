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
applyWithAsString = (algo, alphabetMap, k, m) => pipe([
    applyWith(algo, alphabetMap, k, m),
    join
])

// enryptCharacter  :: {character: Number} -> Number -> Number -> character -> character
const encryptCharacter = curry((alphabetMap, k, m, plainCharacter) => {
    const x = alphabetMap[plainCharacter]
    const y = floor_modulo(x + k, m)
    const cipherCharacter = find(alphabetMap, y)
    return cipherCharacter
})

// decryptCharacter  :: {character: Number} -> Number -> Number -> character -> character
const decryptCharacter = curry((alphabetMap, k, m, cipherCharacter) => {
    const y = alphabetMap[cipherCharacter]
    const x = floor_modulo(y - k, m)
    const plainCharacter = find(alphabetMap, x)
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

const raw = 'attack'
const cipher = shiftCipher(alphabet, 17)
const secret = cipher.encrypt(raw)
const raw2 = cipher.decrypt(secret)
console.log(raw, secret, raw2)