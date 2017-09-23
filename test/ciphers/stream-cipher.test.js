const chai = require('chai')
    , should = chai.should() ;

const { xor, bufferOf, readBuffer, cipherBuffer, transformInput, streamCipher } = require('../../ciphers/stream-cipher')
const { byteKeyGenerator } = require('../../ciphers/cipher-helpers/bit-ring-byte-generators/byte-key-ring')
const { lfsrGenerator } = require('../../ciphers/cipher-helpers/prng/lfsr/external-lfsr-byte-ring')
const { triviumKeyGenerator } = require('../../ciphers/cipher-helpers/trivium/trivium-cipher')

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
        describe('streamCipher(byteKeyGenerator([0,1,0])', () => {
            it('should be able to encrypt and decrypt a string', (done) => {
                const key = [0, 1, 0]
                const encrypt = streamCipher(byteKeyGenerator(key))
                const decrypt = streamCipher(byteKeyGenerator(key))

                // https://stackoverflow.com/questions/23141226/tdd-testing-with-streams-in-nodejs
                const MemoryStream = require('memorystream');
                const memStream = MemoryStream.createWriteStream();

                const plainText = "A message from me\n"
                readStreamFromString(plainText)
                    .pipe(encrypt)
                    .pipe(decrypt)
                    .pipe(memStream)
                    .on('finish', () => {
                        memStream.toString().should.equal(plainText);
                        done();
                    });
            })

        })
        describe('streamCipher(lfsrGenerator([0,1,1,0])', () => {
            it('should be able to encrypt a string which should be different than the plain', (done) => {
                const key = [0, 1, 1, 0]
                const encrypt = streamCipher(lfsrGenerator(key))

                // https://stackoverflow.com/questions/23141226/tdd-testing-with-streams-in-nodejs
                const MemoryStream = require('memorystream');
                const memStream = MemoryStream.createWriteStream();

                const plainText = "A message from me\n"
                readStreamFromString(plainText)
                    .pipe(encrypt)
                    .pipe(memStream)
                    .on('finish', () => {
                        memStream.toString().should.not.equal(plainText);
                        done();
                    });
            })

            it('should be able to encrypt and decrypt a string', (done) => {
                const key = [0, 1, 1, 0]
                const encrypt = streamCipher(lfsrGenerator(key))
                const decrypt = streamCipher(lfsrGenerator(key))

                // https://stackoverflow.com/questions/23141226/tdd-testing-with-streams-in-nodejs
                const MemoryStream = require('memorystream');
                const memStream = MemoryStream.createWriteStream();

                const plainText = "A message from me\n"
                readStreamFromString(plainText)
                    .pipe(encrypt)
                    .pipe(decrypt)
                    .pipe(memStream)
                    .on('finish', () => {
                        memStream.toString().should.equal(plainText);
                        done();
                    });
            })

        })

        describe('streamCipher(triviumKeyGenerator("someKey", "someIV")', () => {
            it('should be able to encrypt a string which should be different than the plain', (done) => {
                const key = 'someKey'
                const iv = 'someIV'
                const encrypt = streamCipher(triviumKeyGenerator(key, iv))

                // https://stackoverflow.com/questions/23141226/tdd-testing-with-streams-in-nodejs
                const MemoryStream = require('memorystream');
                const memStream = MemoryStream.createWriteStream();

                const plainText = "A message from me\n"
                readStreamFromString(plainText)
                    .pipe(encrypt)
                    .pipe(memStream)
                    .on('finish', () => {
                        memStream.toString().should.not.equal(plainText);
                        done();
                    });
            })

            it('should be able to encrypt and decrypt a string', (done) => {
                const key = 'someKey'
                const iv = 'someIV'
                const encrypt = streamCipher(triviumKeyGenerator(key, iv))
                const decrypt = streamCipher(triviumKeyGenerator(key, iv))

                // https://stackoverflow.com/questions/23141226/tdd-testing-with-streams-in-nodejs
                const MemoryStream = require('memorystream');
                const memStream = MemoryStream.createWriteStream();

                const plainText = "A message from me\n"
                readStreamFromString(plainText)
                    .pipe(encrypt)
                    .pipe(decrypt)
                    .pipe(memStream)
                    .on('finish', () => {
                        memStream.toString().should.equal(plainText);
                        done();
                    });
            })
            it('should not be able be able to encrypt and decrypt with different keys', (done) => {
                const key = 'someKey'
                const key2 = 'someOtherKey'
                const iv = 'someIV'
                const encrypt = streamCipher(triviumKeyGenerator(key, iv))
                const decrypt = streamCipher(triviumKeyGenerator(key2, iv))

                // https://stackoverflow.com/questions/23141226/tdd-testing-with-streams-in-nodejs
                const MemoryStream = require('memorystream');
                const memStream = MemoryStream.createWriteStream();

                const plainText = "A message from me\n"
                readStreamFromString(plainText)
                    .pipe(encrypt)
                    .pipe(decrypt)
                    .pipe(memStream)
                    .on('finish', () => {
                        memStream.toString().should.not.equal(plainText);
                        done();
                    });
            })
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