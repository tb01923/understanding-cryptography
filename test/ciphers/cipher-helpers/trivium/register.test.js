const chai = require('chai')
    , should = chai.should() ;

const {register, registerRulesMap} = require('../../../../ciphers/cipher-helpers/trivium/register')
const {arrayOf} = require('../../../../general-helpers/common-bits');
const {reduce} = require('../../../../general-helpers/functional-bits');
const registerARules = registerRulesMap["a"] ;

const arrayOfZero = arrayOf(0)
const oneAt = x => arr => {
    arr[x]=1;
    return arr
}
const registerOf = key => register(key, registerARules)
const pad = k => {
    const pad = arrayOfZero(13)
    return pad.concat(k)
}
const setAt = (R, x) => {
    R.setStateAt(x, 1)
    return R
}
const registerWithOnesAt = l => reduce(
    setAt,
    registerOf(pad(arrayOfZero(80))),
    l
) ;

/*

         1         2         3         4         5         6         7         8         9
123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123
000000000000010000000000000000000000000000000000000000000000000000000000000000000000000000000
111000000000000000000000100100000000000000000000000000000000000000000000000000000000000000000
321098765432109876543210987654321098765432109876543210987654321098765432109876543210987654321
   9         8         7         6         5         4         3         2         1

*/

describe('trivium implementation', function () {

    describe('register A',function (){

        //instantiate correctly
        it('should instantiate with padded 0s', function(){
            registerOf(pad(arrayOfZero(80))).getState().should.deep.equal(
                "000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000"
            )
        })
        it('should instantiate as expected', function(){
            const key1 = pad(oneAt(0)(arrayOfZero(80)))
            const key2 = pad(oneAt(79)(arrayOfZero(80)))
            registerOf(key1).getState().should.deep.equal(
                "000000000000010000000000000000000000000000000000000000000000000000000000000000000000000000000"
            )
            registerOf(key2).getState().should.deep.equal(
                "000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001"
            )
        })

        //output correctly
        it('set should output without advancing', function(){
            const r = registerWithOnesAt([registerARules.xor1, registerARules.xor2, registerARules.and1, registerARules.and2, registerARules.feedback])
            const r2 = registerWithOnesAt([registerARules.xor1, registerARules.xor2, registerARules.and1, registerARules.and2, registerARules.feedback])
            r.getState().should.deep.equal(
                "111000000000000000000000100100000000000000000000000000000000000000000000000000000000000000000"
            )
            r.getState().should.deep.equal(r2.getState())
            r2.getOutput()
            r.getState().should.deep.equal(r2.getState())
        })
        it('set should output with 1,1,1,1,1 in critical positions should output [0, 1]', function(){
            const r = registerWithOnesAt([
                registerARules.xor1, registerARules.xor2, registerARules.and1, registerARules.and2, registerARules.feedback
            ])
            r.getState().should.deep.equal(
                "111000000000000000000000100100000000000000000000000000000000000000000000000000000000000000000"
            )
            r.getOutput().should.deep.equal([0,1])
        })
        it('set should output with 0,1,1,1,1  && 1,0,1,1,1 in critical positions should output [1, 0]',
            function(){
            //0,1,1,1,1
            const r = registerWithOnesAt([
                // registerARules.xor1,
                registerARules.xor2,
                registerARules.and1,
                registerARules.and2,
                registerARules.feedback
            ])
            r.getState().should.equal(
                "111000000000000000000000100000000000000000000000000000000000000000000000000000000000000000000"
            )
            r.getOutput().should.deep.equal([1,0])
            //1,0,1,1,1
            const r2 = registerWithOnesAt([
                registerARules.xor1,
                // registerARules.xor2,
                registerARules.and1,
                registerARules.and2,
                registerARules.feedback
            ])
            r2.getState().should.equal(
                "011000000000000000000000100100000000000000000000000000000000000000000000000000000000000000000"
            )
            r2.getOutput().should.deep.equal([1,0])

            //negative test

            //1,1,1,1,1
            registerWithOnesAt([
                registerARules.xor1,
                registerARules.xor2,
                registerARules.and1,
                registerARules.and2,
                registerARules.feedback
            ]).should.not.deep.equal([1,0])
            //0,0,1,1,1
            registerWithOnesAt([
                // registerARules.xor1,
                // registerARules.xor2,
                registerARules.and1,
                registerARules.and2,
                registerARules.feedback
            ]).should.not.deep.equal([1,0])
        })
        it('set should output with 0,1,0,1,1  && 0,1,1,0,1 &&  1,0,0,1,1  && 1,0,1,0,1  in critical positions ' +
            'should output [1, 1]', function(){
            // 0,1,0,1,1
            const r = registerWithOnesAt([
                // registerARules.xor1,
                registerARules.xor2,
                // registerARules.and1,
                registerARules.and2,
                registerARules.feedback
            ])
            r.getState().should.equal(
                "101000000000000000000000100000000000000000000000000000000000000000000000000000000000000000000"
            )
            r.getOutput().should.deep.equal([1,1])
            //0,1,1,0,1
            const r2 = registerWithOnesAt([
                // registerARules.xor1,
                registerARules.xor2,
                registerARules.and1,
                // registerARules.and2,
                registerARules.feedback
            ])
            r2.getState().should.equal(
                "110000000000000000000000100000000000000000000000000000000000000000000000000000000000000000000"
            )
            r2.getOutput().should.deep.equal([1,1])
            //1,0,0,1,1
            const r3 = registerWithOnesAt([
                registerARules.xor1,
                // registerARules.xor2,
                // registerARules.and1,
                registerARules.and2,
                registerARules.feedback
            ])
            r3.getState().should.equal(
                "001000000000000000000000100100000000000000000000000000000000000000000000000000000000000000000"
            )
            r3.getOutput().should.deep.equal([1,1])
            //1,0,1,0,1
            const r4 = registerWithOnesAt([
                registerARules.xor1,
                // registerARules.xor2,
                registerARules.and1,
                // registerARules.and2,
                registerARules.feedback
            ])
            r4.getState().should.equal(
                "010000000000000000000000100100000000000000000000000000000000000000000000000000000000000000000"
            )
            r4.getOutput().should.deep.equal([1,1])

            // negative tests
            // 1,1,1,1,1
            registerWithOnesAt([
                registerARules.xor1,
                registerARules.xor2,
                registerARules.and1,
                registerARules.and2,
                registerARules.feedback
            ]).should.not.deep.equal([1,1])
        })
        it('set should output with 1,1,0,0,1  && 0,0,0,0,1  in critical positions ' + 'should output [0, 0]',
            function(){
            // 1,1,0,0,1
            const r = registerWithOnesAt([
                registerARules.xor1,
                registerARules.xor2,
                // registerARules.and1,
                // registerARules.and2,
                registerARules.feedback
            ])
            r.getState().should.equal(
                "100000000000000000000000100100000000000000000000000000000000000000000000000000000000000000000"
            )
            r.getOutput().should.deep.equal([0,0])
            // 0,0,0,0,1
            const r2 = registerWithOnesAt([
                // registerARules.xor1,
                // registerARules.xor2,
                // registerARules.and1,
                // registerARules.and2,
                registerARules.feedback
            ])
            r2.getState().should.equal(
                "000000000000000000000000100000000000000000000000000000000000000000000000000000000000000000000"
            )
            r2.getOutput().should.deep.equal([0,0])

        })

        it('update according to rules and advance the pointer', function () {
            // setup
            const r = registerWithOnesAt([
                // registerARules.xor1,
                registerARules.xor2,
                // registerARules.and1,
                registerARules.and2,
                registerARules.feedback
            ])

            // check initial state
            r.getOutput().should.deep.equal([1,1])
            r.getState().should.equal(
                "101000000000000000000000100000000000000000000000000000000000000000000000000000000000000000000"
            )
            r.getPtr().should.equal(0)

            // advance (shiftWith) and check state
            r.shiftWith(0)
            r.getOutput().should.deep.equal([0,0])
            r.getState().should.equal(
                "101000000000000000000000100000000000000000000000000000000000000000000000000000000000000000000"
            )
            r.getPtr().should.equal(1)
            r.get(registerARules.feedback).should.equal(0)


            let start = r.getPtr() ;
            for(let i = start; i <= 67; i++){
                r.shiftWith(1)
                r.get(registerARules.feedback).should.equal(0)
            } //=> advance to Ptr=68

            r.shiftWith(0) //=> Ptr=69
            r.getOutput().should.deep.equal([1,1])
            r.get(registerARules.feedback).should.equal(1)
            r.getPtr().should.equal(69)
            for(let i =0;i<22; i++){
                r.shiftWith(1)
                r.getOutput().should.deep.equal([1,1])
            }
            r.shiftWith(1)
            r.getOutput().should.deep.equal([1,0])
        })

        it('using a shift funciton should produce similar results', function () {
            // setup
            const r = registerWithOnesAt([
                // registerARules.xor1,
                registerARules.xor2,
                // registerARules.and1,
                registerARules.and2,
                registerARules.feedback
            ])

            const shift = r => i => {
                const o = r.getOutput()
                r.shiftWith(i)
                return o
            }
            const shiftR = shift(r)


            // advance (shiftWith) and check state
            shiftR(0).should.deep.equal([1,1])

            const start = r.getPtr() ;
            for(let i = start; i <= 67; i++){
                shiftR(1)
            } //=> advance to Ptr=68

            shiftR(0).should.deep.equal([1,1])
            for(let i =0;i<22; i++){
                shiftR(1).should.deep.equal([1,1])
            }
            shiftR(1).should.deep.equal([1,1])
            shiftR(1).should.deep.equal([1,0])
        })
    })
})