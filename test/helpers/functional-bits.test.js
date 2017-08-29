const mocha = require('mocha')
    , chai = require('chai')
    , should = chai.should() ;

const { reduce, curry, pipe, find, head, tail } = require('../../helpers/functional-bits')

describe('functional-bits', () => {
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

    })
    describe('pipe', () => {

    })
    describe('find', () => {

    })
})
