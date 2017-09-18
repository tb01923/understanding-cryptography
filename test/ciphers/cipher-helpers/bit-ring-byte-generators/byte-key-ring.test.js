const chai = require('chai')
    , should = chai.should() ;

const { ByteKeyRing } = require('../../../../ciphers/cipher-helpers/bit-ring-byte-generators/byte-key-ring')

describe('ciphers/cipher-helpers/bit-ring-byte-generators/byte-key-ring', () => {

    describe('ByteKeyRing', () => {
        it('should be instantiable to a Generator', () => {
            ByteKeyRing(8, [0,1,0]).toString().should.include('Generator')
        })
        it('should support a next method', () => {
            ByteKeyRing(8, [0,1,0]).next.should.be.a('function')
        })
        it('should support a next method that has a value', () => {
            const n = ByteKeyRing(8, [0,1,0]).next()
            n.should.be.an('object').to.have.a.property('value')
        })
        it('should support stretch the array to fill a byte', () => {
            ByteKeyRing(8, [0]).next(/*00000000*/).should.be.an('object').to.have.a.property('value').equal(0)
            ByteKeyRing(8, [1]).next(/*11111111*/).should.be.an('object').to.have.a.property('value').equal(255)
        })
        it('should fill the second byte by starting where the fist left off', () => {
            const ring = ByteKeyRing(8, [0,0,1])
            ring.next(/*00100100*/).should.be.an('object').to.have.a.property('value').equal(36)
            ring.next(/*10010010*/).should.be.an('object').to.have.a.property('value').equal(146)
            ring.next(/*01001001*/).should.be.an('object').to.have.a.property('value').equal(73)
            ring.next(/*00100100*/).should.be.an('object').to.have.a.property('value').equal(36)
        })
    })
})
