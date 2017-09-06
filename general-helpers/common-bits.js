const {pipe, curry} = require('./functional-bits')

// maxOr :: Number -> [Number] -> Number
const maxOr = curry( (def, arr) =>
    (arr.length > 0) ?
        Math.max.apply(null, arr) :
        def
)

// appendToObj :: {...} -> String -> a -> {String: a, ...}
const appendToObj = curry((obj, field, value) => {
    obj[field] = value
    return obj
})

// appendToArray :: [a] -> b -> [a,...b]
const appendToArray = (arr, x) => {
    arr.push(x)
    return arr
}

// increment :: Number -> Number
const increment = x => x +1

// quotient :: (Number, Number) -> Number
const quotient = (dividend, divisor) => Math.floor(dividend / divisor)

// floor_modulo :: (Number, Number) -> Number
const floor_modulo = (dividend, divisor) => dividend - divisor * quotient(dividend, divisor)

// values :: {k: v} -> [v]
const values = (o) => Object.values(o)

// values :: {k: v} -> [String]
const keys = (o) => Object.keys(o)

// length :: [] -> Number
const length = arr => arr.length

// split :: String -> []
const split = str => str.split('')


// numberOfKeys :: {} -> Number
const numberOfKeys = pipe([
    keys,
    length
])

// gcd :: (Number, Number) -> Number
const  gcd = (a, b) =>
    (!b) ?
        a :
        gcd(b, a % b);

const arrayOf = x =>  Array(x).fill(1);
const parseIntBinary = str => parseInt(str,2)

const clone = arr => arr.slice(0)

// join :: String -> [] -> String
const join = char => arr => arr.join(char)


module.exports = {
    maxOr,
    increment,
    appendToObj,
    appendToArray,
    floor_modulo,
    values,
    keys,
    join,
    length,
    numberOfKeys,
    gcd,
    split,
    arrayOf,
    parseIntBinary,
    clone,
    join
}