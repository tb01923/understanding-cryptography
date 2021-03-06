const { Transform } = require('stream');
const { ByteKeyRing } = require('./cipher-helpers/bit-ring-byte-generators/byte-key-ring');
const { curry } = require('../general-helpers/functional-bits')


const readBuffer = b => b.readUIntBE(0, 1)
const bufferOf = x => Buffer.alloc(1, x)
const xor = curry((a,b) => a ^ b)

const cipherBuffer = (keyByte, byteBuffer) => {
    const plainByte = readBuffer(byteBuffer)
    const cipherByte = xor(keyByte, plainByte)
    const cipherByteBuffer = bufferOf(cipherByte)
    return cipherByteBuffer
}


const transformInput = keyGen => byteBuffer => {
    const keyByte = keyGen()
    const cipherByteBuffer = cipherBuffer(keyByte, byteBuffer)
    return cipherByteBuffer
}

// :: (() -> Number) -> Generator
const streamCipher = (nextKey) =>{

    // // nextKey ::
    // const nextKey = byteKeyGenerator(byteKeyArray)

    return new Transform({
        transform(byteBuffer, encoding, callback) {
            this.push(
                transformInput(nextKey)(byteBuffer)
            );
            callback();
        }
    });
}


module.exports = {
    xor,
    bufferOf,
    readBuffer,
    cipherBuffer,
    transformInput,
    streamCipher
}