const {arrayOf, bitArrayFromString, intToBitArray, slice} = require('./general-helpers/common-bits')
const {flatten, pipe, curry, map, reduce} = require('./general-helpers/functional-bits')

const padded16BitArrayFromString = bitArrayFromString(16)
const arrayOf0s = arrayOf(0)


// A Register Initial state markers
//   9         8         7         6         5         4         3         2         1
//321098765432109876543210987654321098765432109876543210987654321098765432109876543210987654321
//111000000000000000000000100100000000000000000000000000000000000000000000000000000000000000000

const registerRulesMap = {
    "a": {xor1: -66, xor2: -93, and1: -92, and2: -91, feedback: -69, length: 93},
    "b": {xor1: -69, xor2: -84, and1: -83, and2: -82, feedback: -78, length: 84},
    "c": {xor1: -66, xor2: -111, and1: -110, and2: -109, feedback: -87, length: 111}
}
// http://basecase.org/trivium/
function register(state, {xor1, xor2, and1, and2, feedback}, label) {
    const ceil = state.length;
    let ptr = 0;

    const getState = function(){
        return state.join('')
    }

    const get = function (n) {
        return state[getIndexOf(n)];
    }

    // it's a ring, everything is in relation to the Ptr
    const getIndexOf = function (n) {
        return (n + ceil + ptr) % ceil;
    }

    const getPtr = function () {
        return ptr
    }

    const setStateAt = function(n, v) {
        n = getIndexOf(n)
        state[n] = v
    }

    const getOutput = function()
    {
        const streamOuput =
            get(xor1) ^
            get(xor2)

        const crossRegisterOutput =
            streamOuput ^
            get(and1) &
            get(and2) ;


        return [
            streamOuput, crossRegisterOutput
        ]
    }

    // this.getFeedback = function(){
    //     return [feedback, this.getIndexOf(feedback), this.get(feedback)]
    // }

    const getNewBit = function(input) {
        return get(feedback) ^ input;
    }

    // updates the current and moves the pointer
    const shiftWith = function (input) {
        // calculate new bit
        state[ptr] = getNewBit(input)
        // move pointer
        ptr = (ptr + 1) % ceil;
    }

    return {
        get,
        getState,
        getIndexOf,
        getNewBit,
        getPtr,
        getOutput,
        setStateAt,
        shiftWith
    }

}

const prefixFillToTargetLength = curry((fillWith, targetLength, partialArr) =>
    flatten([
        arrayOf(fillWith, targetLength - partialArr.length),
        partialArr
    ])
)

const prefix0sToTargetLength = prefixFillToTargetLength(0)

const stringToZeroPaddedRegisterInput = (length) => pipe([
    padded16BitArrayFromString,
    slice(0,80),
    prefix0sToTargetLength(length),
])

const registerOf = (keyBitArray, rules, label) =>
    register(keyBitArray, rules, label)

const createRegisterAB = type => pipe([
    stringToZeroPaddedRegisterInput(registerRulesMap[type].length),
    (bitArray) => registerOf(bitArray, registerRulesMap[type], type)
])

//c register always starts with three 1's followed by 108 0's
const cRegisterBitArray = prefixFillToTargetLength(
    1,
    registerRulesMap['c'].length,
    arrayOf0s(108)) ;

const aRegister = createRegisterAB('a')
const bRegister = createRegisterAB('b')
const cRegister = () => registerOf(cRegisterBitArray, registerRulesMap['c'], 'c')

module.exports = {register, aRegister, bRegister,cRegister, stringToZeroPaddedRegisterInput, registerRulesMap}