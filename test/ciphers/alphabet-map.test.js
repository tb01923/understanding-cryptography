const mocha = require('mocha')
    , chai = require('chai')
    , should = chai.should() ;

const { arrayToAlphabetMap, getNextValue } = require('../../ciphers/alphabet-map')

const { length, keys } = require('../../helpers/common-bits')
const { pipe } = require('../../helpers/functional-bits')

describe('ciphers/alphabet-map', () => {

    describe('arrayToAlphabetMap', () => {
        it('should convert a string to a map (pojso)', () => {
            arrayToAlphabetMap('abc').should.an('object')
        })
        it('the number of keys in the object should equal the length of the string if ' +
            '   the string does not have duplicate characters', () => {

            const countNumberOfKeys = pipe([arrayToAlphabetMap, keys, length])
            countNumberOfKeys('abc').should.equal(3)
            countNumberOfKeys('abc').should.not.equal(4)
        })
        it('should have the expected properties and values', () => {
            const map = arrayToAlphabetMap('abc')
            map.should.include({'a': 0})
            map.should.include({'b': 1})
            map.should.include({'c': 2})
        })
    })

    describe('getNextValue', () => {
        it('should work on an empty object', () => {
            getNextValue({}).should.equal(0)
        })
        it('should shuld find the max value and increment it', () => {
            getNextValue({'a':1}).should.equal(2)
            getNextValue({'a':1, 'b': 2}).should.equal(3)
            getNextValue({'a':1}).should.equal(2)
        })
    })
})
