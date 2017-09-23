// http://www.ecrypt.eu.org/stream/p3ciphers/trivium/trivium_p3.pdf
// http://basecase.org/trivium/

const {arrayOf} = require('../../../general-helpers/common-bits')
const {pipe, map} = require('../../../general-helpers/functional-bits')
const {aRegister, bRegister,cRegister} = require('./register')
const { getNextByte }  = require('../bit-ring-byte-generators/ring-helpers')

const getValuesFromTheseRegisters = (A, B, C) =>
    () => {
        const [aOut, aCross] = A.getOutput();
        const [bOut, bCross] = B.getOutput();
        const [cOut, cCross] = C.getOutput();

        return  [aOut, aCross, bOut, bCross, cOut, cCross];
    }

const shiftTheseRegisters = (A, B, C) =>
    ([aOut, aCross, bOut, bCross, cOut, cCross]) => {
        A.shiftWith(cCross);
        B.shiftWith(aCross);
        C.shiftWith(bCross) ;
        return [aOut, bOut, cOut]
    }

const calculateOutputBit = function([aOut, bOut, cOut]) {
    return aOut ^ bOut ^ cOut ;
}

const trivium_generator = function*(byteLength, key, iv) {

    const A = aRegister(key) ;
    const B = bRegister(iv) ;
    const C = cRegister() ;

    const getNextBit = pipe([
        getValuesFromTheseRegisters(A, B, C),
        shiftTheseRegisters(A, B, C),
        calculateOutputBit
    ])


    const warmUp = pipe([
        arrayOf(null),
        map(getNextBit)
    ])

    // https://en.wikipedia.org/wiki/Trivium_(cipher)
    //  the cipher state is then updated 4 × 288 = 1152 times, so that every bit of the internal
    //  state depends on every bit of the key and of the IV in a complex nonlinear way.
    warmUp(require('./warmup'))

    while(true) {
        yield getNextByte(getNextBit)(byteLength)
    }
}

const triviumKeyGenerator = (key, iv) => {
    const byteSize = 8
    const trivGen = trivium_generator(byteSize, key, iv)
    return () => trivGen.next().value
}


module.exports = { trivium_generator, triviumKeyGenerator }