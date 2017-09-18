const {arrayOf} = require('./general-helpers/common-bits')
const {pipe, curry, map} = require('./general-helpers/functional-bits')
const {aRegister, bRegister,cRegister} = require('./register-a')

// http://www.ecrypt.eu.org/stream/p3ciphers/trivium/trivium_p3.pdf
// http://basecase.org/trivium/
const trivium_generator = function*(key, iv) {

    const A = aRegister(key, 'ga')
    const B = bRegister(iv, 'gb')
    const C = cRegister('gc')


    //let aOut, aCross, bOut, bCross, cOut, cCross = null ;

    let n = 0
    const nextBit = function() {


        const [aOut, aCross] = A.getOutput();
        const [bOut, bCross] = B.getOutput();
        const [cOut, cCross] = C.getOutput();

        const aInp = cCross ;
        const bInp = aCross ;
        const cInp = bCross ;

        A.shiftWith(cCross);
        B.shiftWith(aCross);
        C.shiftWith(bCross) ;

        console.log('g', n++, [aOut, aInp], [bOut, bInp], [cOut, cInp]);

        const bit = aOut ^ bOut ^ cOut ;
        return  bit;
    }

    const warmUp = pipe([
        arrayOf(null),
        map(nextBit)
    ])

    warmUp(require('./warmup'))
    yield "primed";

    while(true) {
        yield nextBit()
    }
}

module.exports = { trivium_generator }