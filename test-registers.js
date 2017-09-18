const {arrayOf, bitArrayFromString, intToBitArray, slice} = require('./general-helpers/common-bits')
const {flatten, pipe, curry, map, reduce} = require('./general-helpers/functional-bits')


const shift = r => i => {
    const o = r.getOutput()
    r.shiftWith(i)
    return o
}
const key = "aaaaa"
const iv = "some iv"
const {aRegisterG, bRegisterG,cRegisterG} = require('./register-g')
const {aRegister, bRegister,cRegister} = require('./register-a')
const A = aRegister(key) ;
const A2 = aRegister(key) ;

const shiftA2 = shift(A2)

let v= true
for(let i = 0; i < 90; i++){
    input = i % 2 ;
    const [outA2, crossA2] = shiftA2(input)
    const [outA, crossA] = A.getOutput()
    A.shiftWith(input)
    v = (outA == outA2 && crossA == crossA2) && v
}
console.log('done -->', v)