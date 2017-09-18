const {arrayOf} = require('./general-helpers/common-bits')
const {pipe, curry, map} = require('./general-helpers/functional-bits')
const {aRegisterG, bRegisterG,cRegisterG} = require('./register-g')

const primeRegisters = (A, B, C) => {
    let [ aBitInput, aCrossRegisterInput ] = [] ;
    let [ bBitInput, bCrossRegisterInput ] = [] ;
    let [ cBitInput, cCrossRegisterInput ] = [] ;

    // the first prime sets up the input for B and C
    [ aBitInput, aCrossRegisterInput ] = A.next(cCrossRegisterInput).value ;
    [ bBitInput, bCrossRegisterInput ] = B.next(aCrossRegisterInput).value ;
    [ cBitInput, cCrossRegisterInput ] = C.next(bCrossRegisterInput).value ;

    // the second prime re-sets up the input for B and C, and sets the input for A
    [ aBitInput, aCrossRegisterInput ] = A.next(cCrossRegisterInput).value ;
    [ bBitInput, bCrossRegisterInput ] = B.next(aCrossRegisterInput).value ;
    [ cBitInput, cCrossRegisterInput ] = C.next(bCrossRegisterInput).value ;

    return [
        aBitInput, aCrossRegisterInput,
        bBitInput, bCrossRegisterInput,
        cBitInput, cCrossRegisterInput
    ]
}

// http://www.ecrypt.eu.org/stream/p3ciphers/trivium/trivium_p3.pdf
// http://basecase.org/trivium/
const trivium_generator = function*(key, iv) {
    const A = aRegisterG(key)
    const B = bRegisterG(iv)
    const C = cRegisterG()

    // prime the register and retain the initial values to feedback across registers
    let  [
        aBitInput, aCrossRegisterInput,
        bBitInput, bCrossRegisterInput,
        cBitInput, cCrossRegisterInput
    ] = primeRegisters(A, B, C) ;

    let n=0
    const nextBit = function() {
        // pump feedback across registers, returning the factors to include in the streamOutput and dependent register
        [ aBitInput, aCrossRegisterInput ] = A.next(cCrossRegisterInput).value ;
        [ bBitInput, bCrossRegisterInput ] = B.next(aCrossRegisterInput).value ;
        [ cBitInput, cCrossRegisterInput ] = C.next(bCrossRegisterInput).value ;

        // console.log(n++, 'g', aCrossRegisterInput,bCrossRegisterInput,cCrossRegisterInput,aBitInput,bBitInput,cBitInput)

        return [aBitInput ,bBitInput ,cBitInput];
        return aBitInput ^ bBitInput ^ cBitInput;
    }

    const warmUp = pipe([
        arrayOf(null),
        map(nextBit)
    ])

    //warmUp(1152)
    yield "primed";

    while(true) {
        yield nextBit()
    }
}

module.exports = { trivium_generator }