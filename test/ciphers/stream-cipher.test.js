const mocha = require('mocha')
    , chai = require('chai')
    , should = chai.should() ;

const { xor, bufferOf, readBuffer, cipherBuffer, streamCipher } = require('../../ciphers/stream-cipher')

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


})
