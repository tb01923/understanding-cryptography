// http://basecase.org/trivium/

const {aRegister, bRegister,cRegister} = require('../ciphers/cipher-helpers/trivium/register')


function trivium_gen(key, iv) {
    var stream_bit = -1 * require('../ciphers/cipher-helpers/trivium/warmup'); // the first bits are weak, remember?

    var A = aRegister(key, 'la')
    var B = bRegister(iv, 'lb')
    var C = cRegister('lc')

    this.nextbit = function() {

        const [aOut, aCross] = A.getOutput();
        const [bOut, bCross] = B.getOutput();
        const [cOut, cCross] = C.getOutput();

        A.shiftWith(cCross);
        B.shiftWith(aCross);
        C.shiftWith(bCross) ;

        const bit = aOut ^ bOut ^ cOut ;

        stream_bit++;
        return bit ;
    }


    while (stream_bit < 0) {
        this.nextbit();
    }
}

module.exports = {trivium_gen}