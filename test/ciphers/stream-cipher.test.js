const chai = require('chai')
    , should = chai.should() ;

const { xor, bufferOf, readBuffer, cipherBuffer,
    byteKeyGenerator, transformInput, streamCipher } = require('../../ciphers/stream-cipher')

const { Readable } = require('stream');
const readStreamFromString = s =>
{
    var r = new Readable();
    r._read = function noop() {};
    s.split('').map(
        (x) => r.push(x)
    )
    r.push(null);
    return r
}


describe('ciphers/stream-cipher', () => {

    describe('xor', () => {
        it('0,0 should be 0', () => {
            xor(0,0).should.equal(0)
        })
        it('1,1 should be 0', () => {
            xor(1,1).should.equal(0)
        })
        it('1,0 should be 0', () => {
            xor(1,0).should.equal(1)
        })
        it('0,1 should be 0', () => {
            xor(0,1).should.equal(1)
        })
        it('65,73 should be 8', () => {
            xor(65,73).should.equal(8)
        })
        it('double xor with same key should return original', () => {
            xor(73,xor(73,65)).should.equal(65)
        })
    })

    describe('bufferOf', () => {
        it('should convert a byte into a Buffer', () => {
            //https://github.com/chaijs/chai/issues/1028
            //bufferOf(1).should.be.a('buffer')
            bufferOf(1).should.be.a('Uint8Array')
        })
        it('should convert a byte into a Buffer', () => {
            bufferOf(1)[0].should.equal(1)
            bufferOf(65)[0].should.equal(65)
        })
    })

    describe('bufferOf', () => {
        it('should convert a byte into a Buffer', () => {
            //https://github.com/chaijs/chai/issues/1028
            //bufferOf(1).should.be.a('buffer')
            bufferOf(1).should.be.a('Uint8Array')
        })
        it('should convert a byte into a Buffer', () => {
            bufferOf(1)[0].should.equal(1)
            bufferOf(65)[0].should.equal(65)
        })
    })

    describe('readBuffer', () => {
        it('should be able to read a byte from a Buffer', () => {
            const buffer = bufferOf(1)
            readBuffer(buffer).should.equal(1)
        })
    })

    describe('cipherBuffer', () => {
        it('should be able to encrypt a byte from a Buffer', () => {
            const key = 73
            const value = bufferOf(65)
            const encryptedBuffer = cipherBuffer(key, value)

            //https://github.com/chaijs/chai/issues/1028
            //encryptedBuffer.should.be.a('buffer')
            encryptedBuffer.should.be.a('Uint8Array')
            encryptedBuffer[0].should.equal(8)
        })

        it('should be able to encrypt and decrypt a byteb from a buffer by applying twice', () => {
            const key = 73
            const plainBuffer = bufferOf(65)
            const encryptedBuffer = cipherBuffer(key, plainBuffer)
            const decryptedBuffer = cipherBuffer(key, encryptedBuffer)

            //https://github.com/chaijs/chai/issues/1028
            //encryptedBuffer.should.be.a('buffer')
            encryptedBuffer.should.be.a('Uint8Array')
            decryptedBuffer.should.be.a('Uint8Array')

            encryptedBuffer[0].should.equal(8)
            decryptedBuffer[0].should.equal(65)
        })
    })

    describe('streamCipher', () => {
        it('should be able to encrypt and decrypt a string', () => {
            const key = [0,1,0]
            const encrypt = streamCipher(key)
            const decrypt = streamCipher(key)

            readStreamFromString("A message from me\n")
                .pipe(encrypt)
                .pipe(decrypt)
                .pipe(process.stdout)

        })
    })

    describe('byteKeyGenerator', () => {
        it('should return a funciton', () => {
            byteKeyGenerator([1]).should.be.a('function')
        })
        it('given 8 bit arrray it should always return the same byte', () => {
            const always2 =byteKeyGenerator([0,0,0,0,0,0,1,0])
            always2().should.equal(2)
            always2().should.equal(2)
        })
        it('given a one bit array it should repeat that value 8 times', () => {
            byteKeyGenerator([1])().should.equal(255)
            byteKeyGenerator([0])().should.equal(0)
        })
        it('given 4 bit arrray it should repeat', () => {
            byteKeyGenerator([0,0,0,1])().should.equal(17)
        })
    })

    describe('transformInput', () => {
        const always = (x) => () => x
        const transformBy1 = transformInput(always(1))
        const transformBy0 = transformInput(always(0))
        const bufferOf1 = bufferOf(1)
        const bufferOf0 = bufferOf(0)

        it('should support the XOR truth table through buffers', () => {
            transformBy1(bufferOf1).should.deep.equal(bufferOf0)
            transformBy1(bufferOf0).should.deep.equal(bufferOf1)
            transformBy0(bufferOf1).should.deep.equal(bufferOf1)
            transformBy0(bufferOf0).should.deep.equal(bufferOf0)
        })
    })

})
