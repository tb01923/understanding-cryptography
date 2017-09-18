const {arrayOf, bitArrayFromString, intToBitArray, slice} = require('./general-helpers/common-bits')
const {flatten, pipe, curry, map, reduce} = require('./general-helpers/functional-bits')


// function encrypt(key, iv, s) {
//     s = padded16BitArrayFromString(s);
//     var plain = [];
//     var T = new trivium_gen(key, iv);
//     for (var point=0; point<s.length; point++) {
//         plain[point] = s[point] ^ T.nextpoint(); }
//     return plain;
// }

console.log('ll p i n s ->state')


const key = "AAAAAA" ;
const iv = "some iv"
const trivium_generator2 = require('./trivium-cipher-g-leg-register-shift').trivium_generator
const TG_L_SHIFT = trivium_generator2(key, iv)
console.log('prime', TG_L_SHIFT.next().value)
const {trivium_generator} = require('./trivium-cipher-g-leg-register-flip')
const TG_L_FLIP = trivium_generator (key, iv)
console.log('prime', TG_L_FLIP.next().value)
const {trivium_gen} = require('./trivium-cipher-a')
const TL_L_FLIP = new trivium_gen(key, iv)





let s1 = s2 = s3 = ""
const test = function(i) {
    const bit1 = TL_L_FLIP.nextbit() ;
    const bit2 = TG_L_FLIP.next().value ;
    const bit3 = TG_L_SHIFT.next().value ;
    s1 += bit1
    s2 += bit2
    s3 += bit3
    // console.log('iter', i)
    console.log()
    const x = (bit1 === bit2) && (bit1 === bit3)
    return x
}
let v = true
for(let i = 0; i < 75; i++){
    v = test(i) && v
}
console.log('done -->', v)
console.log('         1         2         3         4         5         6         7         8')
console.log('12345678901234567890123456789012345678901234567890123456789012345678901234567890')

console.log(s1)
console.log(s2)
console.log(s3)

