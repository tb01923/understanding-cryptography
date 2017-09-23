const { getNextByte }  = require('./ring-helpers')

const ByteKeyRing = function *(byteLength, keyBitArray) {
    // store the length so we know when to wrap
    const keyBitArrayLength = keyBitArray.length

    // state that drives the next bit in the rotator
    let i = -1

    // bitRotator
    //  shifts the bits in the register
    //  ** CAUTION: MUTATES register **
    // bitRotator :: unit -> Bit
    const bitRotator = () => {
        // notice mutating i
        i = i + 1

        // find the index in the array by modulo
        const index = i % keyBitArrayLength

        //return the bit in that position
        return keyBitArray[index]
    }

    // return a byte whenever asked
    while(true) {
        yield getNextByte(bitRotator)(byteLength)
    }
}

const byteKeyGenerator = (byteKeyArray) => {
    const byteSize = 8
    const byteKeyRing = ByteKeyRing(byteSize, byteKeyArray)
    return () => byteKeyRing.next().value
}



module.exports = {
    ByteKeyRing,
    byteKeyGenerator
}