const {arrayOf, bitArrayFromString, intToBitArray, slice} = require('../general-helpers/common-bits')
const {flatten, pipe, curry, map} = require('../general-helpers/functional-bits')


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
const register_generator = function*(state, {xor1, xor2, and1, and2, feedback}, label) {
    if(label == 'b'){
        console.log('Starting')
    }

    const ceil = state.length;
    let ptr = 0;

    const indexFor = n => () => {
        return (n + ceil + ptr) % ceil;
    }
    const xor1Index = indexFor(xor1)
    const xor2Index = indexFor(xor2)
    const and1Index = indexFor(and1)
    const and2Index = indexFor(and2)
    const feedbackIndex = indexFor(feedback)

    const streamOutput = () =>
    state[xor1Index()] ^
    state[xor2Index()] ;

    const crossRegisterOutput = () =>
    streamOutput() ^
    state[and1Index()] &
    state[and2Index()] ;

    const output = () => [
        streamOutput(),
        crossRegisterOutput()
    ]

    let n = 0 ;
    input = yield output();
    input = yield output();

    while(true){
        const o = output() ;
        state[ptr] = state[feedbackIndex()] ^ input;


        ptr = (ptr + 1) % ceil;
        input = yield o ;
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

const aRegisterG = key => register_generator(
    stringToZeroPaddedRegisterInput(REGISTER_A_LENGTH)(key),
    registerRulesMap['a'], 'a'
);
const bRegisterG = iv => register_generator(
    stringToZeroPaddedRegisterInput(REGISTER_B_LENGTH)(iv),
    registerRulesMap['b'], 'b'
);

const cRegisterG = () => register_generator(
    prefixFillToTargetLength(1, REGISTER_C_LENGTH, arrayOf0s(REGISTER_C_LENGTH - 3)),
    registerRulesMap['c'], 'c'
) ;

module.exports = {register_generator, aRegisterG, bRegisterG,cRegisterG}