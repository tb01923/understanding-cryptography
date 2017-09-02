const { Transform } = require('stream');
const { ByteKeyRing } = require('./cipher-helpers/byte-key-ring');
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

const streamCipher = (byteKeyArray) =>{

    byteSize = 8
    const byteKeyRing = ByteKeyRing(byteSize, byteKeyArray)
    const getKey = () => byteKeyRing.next().value

    return new Transform({
        transform(byteBuffer, encoding, callback) {
            const keyByte = getKey()
            const cipherByteBuffer = cipherBuffer(keyByte, byteBuffer)
            this.push(cipherByteBuffer);
            callback();
        }
    });
}


module.exports = {
    xor,
    bufferOf,
    readBuffer,
    cipherBuffer,
    streamCipher
}