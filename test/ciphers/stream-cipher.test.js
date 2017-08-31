const mocha = require('mocha')
    , chai = require('chai')
    , should = chai.should() ;

const { xor, stringToBitArray } = require('../../ciphers/stream-cipher')

const { length, keys } = require('../../helpers/common-bits')
const { pipe } = require('../../helpers/functional-bits')

describe('ciphers/block-cipher', () => {

    describe('xor', () => {
        it('0,0 should be 0', () => {
            xor(0,0).should.equal(0)
        })
        it('1,1 should be 0', () => {
            xor(1,1).should.equal(0)
        })
        it('1,0 should be 0', () => {
            xor(1,0).should.equal(1)
        })
        it('0,1 should be 0', () => {
            xor(0,1).should.equal(1)
        })
    })
    describe('stringToBitArray', () => {
        it('should work on an empty string', () => {
            stringToBitArray('').should.be.an('array').with.a.lengthOf(0);
        })
        it('should work on a string', () => {
            stringToBitArray('10').should.be.an('array').with.a.lengthOf(2).and.include(1);
            stringToBitArray('10').should.be.an('array').with.a.lengthOf(2).and.include(0);
        })
    })

})
