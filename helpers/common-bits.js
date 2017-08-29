const {reduce, pipe, curry} = require('./functional-bits')

const maxOr = curry( (def, arr) =>
    (arr.length > 0) ?
        Math.max.apply(null, arr) :
        def
)

const appendToObj = curry((obj, field, value) => {
    obj[field] = value
    return obj
})

const appendToArray = (arr, x) => {
    arr.push(x)
    return arr
}

const increment = x => x +1

const quotient = (dividend,divisor) => Math.floor(dividend/divisor)
const floor_modulo = (dividend,divisor) => dividend - divisor * quotient(dividend,divisor)


const values = (o) => Object.values(o)

const keys = (o) => Object.keys(o)

const join  = arr => arr.join('')

const length = arr => arr.length

const numberOfKeys = pipe([
    keys,
    length
])

const  gcd = function(a, b) {
    if ( ! b) {
        return a;
    }

    return gcd(b, a % b);
};

module.exports = {maxOr, increment, appendToObj, appendToArray, floor_modulo, values, keys, join, length, numberOfKeys, gcd}