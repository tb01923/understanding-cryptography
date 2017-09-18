const chai = require('chai')
    , should = chai.should() ;

const { maxOr, increment, appendToObj, appendToArray, floor_modulo, split, bitArrayFromBinaryString,
    values, keys, join, length, numberOfKeys, gcd } = require('../../general-helpers/common-bits')

describe('general-helpers/common-bits', () => {
    describe('bitArrayFromBinaryString', () => {
        it('should work on an empty string', () => {
            bitArrayFromBinaryString('').should.be.an('array').with.a.lengthOf(0);
        })
        it('should work on a string', () => {
            bitArrayFromBinaryString('10').should.be.an('array').with.a.lengthOf(2).and.include(1);
            bitArrayFromBinaryString('10').should.be.an('array').with.a.lengthOf(2).and.include(0);
        })
    })

    describe('maxOr', () => {
        it('maxOr should return the max of an array not default value', () => {
            maxOr(-1, [10,22,10]).should.be.equal(22) ;
        })
        it('maxOr should return the default value when an empty array is specified', () => {
            maxOr(-1, []).should.be.equal(-1) ;
        })
    })
    describe('increment', () => {
        it('increment should return NaN if it is not passed anything', () => {
            increment().should.be.NaN ;
        })
        it('increment should increment an Number by adding 1', () => {
            increment(2).should.be.equal(3) ;
        })
    })
    describe('appendToObject', () => {
        it('should append a value to an empty object', () => {
            appendToObj({}, 'a', 1).should.have.a.property('a').equal(1);
        })
        it('should append a value to an existing object', () => {
            appendToObj({'b': 3}, 'a', 1).should.have.a.property('a').equal(1);
            appendToObj({'b': 3}, 'a', 1).should.have.a.property('b').equal(3);
        })
        it('should overwrite a value in an object that already has that property', () => {
            appendToObj({'a': 3}, 'a', 1).should.have.a.property('a').equal(1);
        })
    })
    describe('appendToArray', () => {
        it('should append a value to an empty array', () => {
            appendToArray([], 1).should.have.a.lengthOf(1).and.include(1);
        })
        it('should append a value to an non empty array', () => {
            appendToArray([1], 2).should.have.a.lengthOf(2).and.include(1);
            appendToArray([1], 2).should.have.a.lengthOf(2).and.include(2);
        })
    })
    describe('floor_modulo', () => {
        it('should work on positive numbers', () => {
            floor_modulo(10,3).should.equal(1);
        })
        it('should work on negative numbers', () => {
            floor_modulo(-10,3).should.not.equal(1);
            floor_modulo(-10,3).should.equal(2);
        })
    })
    describe('values', () => {
        it('should return an empty array on an empty pojso', () => {
            values({}).should.be.an('array').with.a.lengthOf(0);
        })
        it('should return all the property values iof an pojso', () => {
            values({'a': 1, 'b': 2}).should.be.an('array').with.a.lengthOf(2);
            values({'a': 1, 'b': 2}).should.include(1) ;
            values({'a': 1, 'b': 2}).should.include(2);
        })
    })
    describe('keys', () => {
        it('should return an empty array on an empty pojso', () => {
            keys({}).should.be.an('array').with.a.lengthOf(0);
        })
        it('should return all the property values iof an pojso', () => {
            keys({'a': 1, 'b': 2}).should.be.an('array').with.a.lengthOf(2);
            keys({'a': 1, 'b': 2}).should.include('a') ;
            keys({'a': 1, 'b': 2}).should.include('b');
        })
    })
    describe('join', () => {
        it('should return an empty string when passed an empty array', () => {
            join('')([]).should.equal('')
        })
        it('should return a string with all values concatenated', () => {
            join('')([1,2,3]).should.equal('123')
        })
    })
    describe('length', () => {
        it('should return 0 when passed an empty array', () => {
            length([]).should.equal(0)
        })
        it('should return with the length of the array', () => {
            length([1,2,3]).should.equal(3)
        })
    })
    describe('numberOfKeys', () => {
        it('should count the number of properties in a pojso', () => {
            numberOfKeys({}).should.equal(0)
            numberOfKeys({'a': 1}).should.equal(1)
            numberOfKeys({'a': 1, 'b': 1}).should.equal(2)
        })
    })
    describe('gcd', () => {
        it('should return 1 if there are no common divisors', () => {
            gcd(13,17).should.equal(1)
        })
        it('should return a gcd if passed even numbers', () => {
            gcd(20,10).should.equal(10)
        })
    })

    describe('split', () => {
        it('should return an empty array when passed an empty string', () => {
            split('').should.be.an('array').with.a.lengthOf(0);
        })
        it('should return a ', () => {
            split('12').should.be.an('array').with.a.lengthOf(2).to.include('1');
            split('12').should.be.an('array').with.a.lengthOf(2).to.include('2');
        })
    })


})
