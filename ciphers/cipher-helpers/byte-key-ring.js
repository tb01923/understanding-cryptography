const { pipe, map } = require('../../general-helpers/functional-bits')
const { split } = require('../../general-helpers/common-bits')

const ByteKeyRing = function *(byteLength, keyBitArray) {
    const keyBitArrayLength = keyBitArray.length
    let i = 0

    while(true) {
        const byte = []
        for(let n = 0; n < byteLength; n++)
        {
            const index = i % keyBitArrayLength
            const bit = keyBitArray[index]
            byte.push(bit)
            i = i + 1
        }
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