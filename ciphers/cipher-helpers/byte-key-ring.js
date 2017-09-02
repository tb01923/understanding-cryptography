const { pipe, map } = require('../../general-helpers/functional-bits')
const { split } = require('../../general-helpers/common-bits')

const ByteKeyRing = function *(byteLength, keyBitArray) {
    // store the length so we know when to wrap
    const keyBitArrayLength = keyBitArray.length

    // loop in perpetuity incrementing i
    let i = 0
    while(true) {
        // build a byte according to the specified length
        const byte = []
        for(let n = 0; n < byteLength; n++)
        {
            // i mod keyBitArrayLength in {0..keyBitArrayLength-1}
            const index = i % keyBitArrayLength

            // store the bit
            const bit = keyBitArray[index]
            byte.push(bit)
            i = i + 1
        }
        //
        yield parseInt(byte.join(''),2)
    }
}

const keyBitArrayFromString = pipe([
    split,
    map(parseInt)
])


module.exports = {
    keyBitArrayFromString,
    ByteKeyRing
}