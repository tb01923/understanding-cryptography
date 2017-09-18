const {arrayOf, bitArrayFromString, intToBitArray, slice} = require('./general-helpers/common-bits')
const {flatten, pipe, curry, map, reduce} = require('./general-helpers/functional-bits')

const padded16BitArrayFromString = bitArrayFromString(16)
const arrayOf0s = arrayOf(0)


const REGISTER_A_LENGTH = 93
const REGISTER_B_LENGTH = 84
const REGISTER_C_LENGTH = 111


const registerRulesMap = {
    "a": {xor1: -66, xor2: -REGISTER_A_LENGTH, and1: -92, and2: -91, feedback: -69},
    "b": {xor1: -69, xor2: -REGISTER_B_LENGTH, and1: -83, and2: -82, feedback: -78},
    "c": {xor1: -66, xor2: -REGISTER_C_LENGTH, and1: -110, and2: -109, feedback: -87}
}
// http://basecase.org/trivium/
function register(state, {xor1, xor2, and1, and2, feedback}, label) {
    var ceil = state.length;
    var ptr = 0;

    this.get = function (n) {
        n = (n + ceil + ptr) % ceil;
        return state[n];
    }

    this.getI = function (n) {
        n = (n + ceil + ptr) % ceil;
        return n;
    }

    this.getOutput = function()
    {
        if(label =='c'){
            console.log(n, ptr, 'r', 'a', state.join(''))
        }

        const streamOuput =
            this.get(xor1) ^
            this.get(xor2)

        const crossRegisterOutput =
            streamOuput ^
            this.get(and1) &
            this.get(and2) ;

        return [
            streamOuput, crossRegisterOutput
        ]
    }


    let n = 0
    this.shiftWith = function (input) {
        if(label =='c'){
            console.log(n, ptr, 'r', 'a', input)
        }
        state[ptr] = this.get(feedback) ^ input;
        ptr = (ptr + 1) % ceil;
        n++ ;
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
    prefix0sToTargetLength(length)
])

const aRegister = key => new register(
    stringToZeroPaddedRegisterInput(REGISTER_A_LENGTH)(key),
    registerRulesMap['a'], 'a'
);
const bRegister = iv => new register(
    stringToZeroPaddedRegisterInput(REGISTER_B_LENGTH)(iv),
    registerRulesMap['b'], 'b'
);
const cRegister = () => new register(
    prefixFillToTargetLength(1, REGISTER_C_LENGTH, arrayOf0s(108)),
    registerRulesMap['c'], 'c'
) ;

module.exports = {register, aRegister, bRegister,cRegister}