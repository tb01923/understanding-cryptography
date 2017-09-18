const {arrayOf} = require('./general-helpers/common-bits')
const {pipe, map} = require('./general-helpers/functional-bits')
const {aRegister, bRegister,cRegister} = require('./register-a')

// http://www.ecrypt.eu.org/stream/p3ciphers/trivium/trivium_p3.pdf
// http://basecase.org/trivium/
const trivium_generator = function*(key, iv) {
    const A = aRegister(key)
    const B = bRegister(iv)
    const C = cRegister()

    let aOut, aCross, bOut, bCross, cOut, cCross = null ;

    [aOut, aCross] = A.getOutput();
    [bOut, bCross] = B.getOutput();
    [cOut, cCross] = C.getOutput();

    const nextBit = function() {

        [aOut, aCross] = A.getOutput();
        [bOut, bCross] = B.getOutput();
        [cOut, cCross] = C.getOutput();



        A.shiftWith(cCross);
        B.shiftWith(aCross);
        C.shiftWith(bCross) ;

        const bit = aOut ^ bOut ^ cOut ;
        console.log('f', cCross, aCross, bCross, aOut, bOut, cOut, bit)

        return bit;
    }

    const warmUp = pipe([
        arrayOf(null),
        map(nextBit)
    ])

    warmUp(require('./warmup'))
    yield "primed";

    while(true) {
        yield nextBit() ;
    }
}

module.exports = { trivium_generator }