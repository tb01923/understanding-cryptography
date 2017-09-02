const mocha = require('mocha')
    , chai = require('chai')
    , should = chai.should() ;

const { reduce, curry, pipe, findKeyByValue, head, tail, map } = require('../../general-helpers/functional-bits')

describe('general-helpers/functional-bits', () => {
    describe('head', () => {
        it('should return the first item in the list', () => {
            head([10,22,123]).should.be.equal(10) ;
        })
    })
    describe('tail', () => {
        it('should return the list without the first item', () => {
            tail([10, 22,123]).should.have.a.lengthOf(2) ;
            tail([10, 22,123]).should.include(22) ;
            tail([10, 22,123]).should.include(123) ;
            tail([10, 22,123]).should.not.include(10) ;
        })
    })
    describe('curry', () => {
        const sum = (a,b) => a + b
        it('should partially apply parameters to a function', () => {
            curry(sum).should.be.a('function');
            curry(sum)(1).should.be.a('function');
        })
        it('should invoke when parameters are satisfied', () => {
            curry(sum)(1,2).should.be.equal(3);
            curry(sum)(1)(2).should.be.equal(3);
            curry(sum)(1,2).should.not.equal(4);
        })
    })
    describe('reduce', () => {
        const sum = (a,b) => a + b
        it('should be able to sum an array of numbers', () => {
            reduce(sum, 0, [1,2,3]).should.equal(6)
        })
        it('should curry by default', () => {
            reduce(sum).should.be.a('function');
            reduce(sum, 0).should.be.a('function');
        })
    })
    describe('pipe', () => {
        const double = x => x * 2
        const square = x => x * x
        it('should be able to left to right compose functions', () => {
            pipe([double, square]).should.be.a('function');
        })
        it('should invoke when passed a value, by passing that into the left most function ' +
            'whose results are fed into the next function in the chain', () => {
            pipe([double, square])(2).should.equal(16)
        })
    })
    describe('findKeyByValue', () => {
        it('should return the key if the value is present', () => {
            findKeyByValue({'a':1,'b':2,'c':3}, 2).should.equal('b');
        })
        it('should return undefined if the value is present', () => {
            (typeof findKeyByValue({'a':1,'b':2,'c':3}, 4)).should.equal('undefined') ;
        })
    })
    describe('map', () => {
        it('should partial apply a function', () => {
            const increment = x => x + 1
            map(increment).should.be.a('function') ;
        })
        it('should work on an empty array', () => {
            const increment = x => x + 1
            map(increment, []).should.be.an('array').with.a.lengthOf(0);
        })
        it('should work on all elements', () => {
            const increment = x => x + 1
            map(increment, [0,2]).should.be.an('array').with.a.lengthOf(2).to.include(1);
            map(increment, [0,2]).should.be.an('array').with.a.lengthOf(2).to.include(3);
        })
    })


})
