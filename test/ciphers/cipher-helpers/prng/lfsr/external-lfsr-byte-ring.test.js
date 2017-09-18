const chai = require('chai')
    , should = chai.should() ;

const { ExternalLfsrByteRing } = require('../../../../../ciphers/cipher-helpers/prng/lfsr/external-lfsr-byte-ring')
const taps = require('../../../../../ciphers/cipher-helpers/prng/lfsr/lfsr-taps')

describe('ciphers/cipher-helpers/prng/lfsr/external-lfsr-byte-ring', () => {

    describe('ExternalLfsrByteRing', () => {

        it('should be instantiable to a Generator', () => {
            ExternalLfsrByteRing(8, [0,1,0]).toString().should.include('Generator')
        })
        it('should support a next method', () => {
            ExternalLfsrByteRing(8, [0,1,0]).next.should.be.a('function')
        })
        it('should support a next method that has a value', () => {
            const n = ExternalLfsrByteRing(8, [0,1,0]).next()
            n.should.be.an('object').to.have.a.property('value')
        })
        it('should only return zero if seeded with all zeros', () => {
            const ring = ExternalLfsrByteRing(8, [0,0])
            // max possible values for 2 bit LFSR
            //    = x**n - 1
            //    = 2**2 - 1
            //    = 3
            // therefore need to check at least three bytes.
            ring.next(/*00000000*/).should.be.an('object').to.have.a.property('value').equal(0)
            ring.next(/*00000000*/).should.be.an('object').to.have.a.property('value').equal(0)
            ring.next(/*00000000*/).should.be.an('object').to.have.a.property('value').equal(0)
        })
        it('3 Bit LFSR of ' + taps[3].polynomial +
            ' matching: https://cs.stackexchange.com/questions/3337/lfsr-sequence-computation', () => {
            const ring = ExternalLfsrByteRing(8, [1,0,1])
            ring.next(/*10111001*/).should.be.an('object').to.have.a.property('value').equal(185)
            ring.next(/*01110010*/).should.be.an('object').to.have.a.property('value').equal(114)
            ring.next(/*11100101*/).should.be.an('object').to.have.a.property('value').equal(229)
            ring.next(/*11001011*/).should.be.an('object').to.have.a.property('value').equal(203)
            ring.next(/*10010111*/).should.be.an('object').to.have.a.property('value').equal(151)
            ring.next(/*00101110*/).should.be.an('object').to.have.a.property('value').equal(46)
            ring.next(/*01011100*/).should.be.an('object').to.have.a.property('value').equal(92)
            ring.next(/*10111001*/).should.be.an('object').to.have.a.property('value').equal(185)
        })
    })
})
