const {arrayOf} = require('./general-helpers/common-bits')
const {pipe, map} = require('./general-helpers/functional-bits')
const {aRegister, bRegister,cRegister} = require('./register-a')

const shift = l => r => i => {
    const o = r.getOutput()
    r.shiftWith(i)
    return o
}

// http://www.ecrypt.eu.org/stream/p3ciphers/trivium/trivium_p3.pdf
// http://basecase.org/trivium/
const trivium_generator = function*(key, iv) {
    const A = aRegister(key, 'sa')
    const B = bRegister(iv, 'sb')
    const C = cRegister('sc')

    const shiftA = shift('sa')(A);
    const shiftB = shift('sb')(B) ;
    const shiftC = shift('sc')(C)
    let aOut, aCross, bOut, bCross, cOut, cCross = null ;

    [aOut, aCross] = A.getOutput();
    [bOut, bCross] = B.getOutput();
    [cOut, cCross] = C.getOutput();


    // [aOut, aCross] = shiftA(cCross);
    // [bOut, bCross] = shiftB(aCross);
    // [cOut, cCross] = shiftC(bCross);


    console.log('s', -1, [aOut, cCross], [bOut, aCross], [cOut, bCross]);

    let n = 0;
    const nextBit = function() {
        const aInp = cCross ;
        [aOut, aCross] = shiftA(cCross);
        const bInp = aCross ;
        [bOut, bCross] = shiftB(aCross);
        const cInp = bCross ;
        [cOut, cCross] = shiftC(bCross);



        const bit = aOut ^ bOut ^ cOut ;
        console.log('s', n++, [aOut, aInp], [bOut, bInp], [cOut, cInp]);
        return bit ;
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