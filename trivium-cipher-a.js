const {arrayOf, bitArrayFromString, intToBitArray, slice} = require('./general-helpers/common-bits')
const {flatten, pipe, curry, map} = require('./general-helpers/functional-bits')

const padded16BitArrayFromString = bitArrayFromString(16)
const arrayOf0s = arrayOf(0)

const {aRegister, bRegister,cRegister} = require('./register-a')


function trivium_gen(key, iv) {
    var stream_bit = -1 * require('./warmup'); // the first bits are weak, remember?

    var A = aRegister(key, 'la')
    var B = bRegister(iv, 'lb')
    var C = cRegister('lc')

    let n=0
    this.nextbit = function() {

        const [aOut, aCross] = A.getOutput();
        const [bOut, bCross] = B.getOutput();
        const [cOut, cCross] = C.getOutput();

        const aInp = cCross ;
        const bInp = aCross ;
        const cInp = bCross ;


        A.shiftWith(cCross);
        B.shiftWith(aCross);
        C.shiftWith(bCross) ;

        const bit = aOut ^ bOut ^ cOut ;

        console.log('l', n++,  [aOut, aInp], [bOut, bInp], [cOut, cInp]);

        stream_bit++;
        return bit ;
    }


    while (stream_bit < 0) {
        this.nextbit();
    }
}

module.exports = {trivium_gen}