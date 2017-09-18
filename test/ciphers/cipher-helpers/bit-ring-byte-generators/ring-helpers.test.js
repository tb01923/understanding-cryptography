const chai = require('chai')
    , should = chai.should() ;

const { getNextByte } = require('../../../../ciphers/cipher-helpers/bit-ring-byte-generators/ring-helpers')

describe('ciphers/cipher-helpers/bit-ring-byte-generators/ring-helpers', () => {

    describe('getNextByte', () => {
        const always = (x) => () => x
        it('should not fail', () => {
            getNextByte(always(1))(8).should.equal(255)
            getNextByte(always(0))(8).should.equal(0)
        })

    })
})
