const mocha = require('mocha')
    , chai = require('chai')
    , should = chai.should() ;

const { affineCipher, encryptCharacter, decryptCharacter } = require('../../ciphers/affine-cipher')
const { englishAlphabet } = require('../../ciphers/cipher-helpers/alphabet-map')
const { numberOfKeys } = require('../../general-helpers/common-bits')

describe('ciphers/affine-cipher', () => {
    describe('should behave like the shift cipher with an "a" value of 1', () => {
        describe('encryptCharacter', () => {
            it('should encrypt a character that does not need to wrap around the end of the alphabet', () => {
                const simpleMap =  {'a': 0, 'b': 1}
                const m = numberOfKeys(simpleMap)
                const a = 1
                const b = 1
                encryptCharacter(simpleMap, a, b, m, 'a').should.equal('b')
            })
            it('should encrypt a character that needs to wrap around the end of the alphabet', () => {
                const simpleMap =  {'a': 0, 'z': 1}
                const m = numberOfKeys(simpleMap)
                const a = 1
                const b = 1
                encryptCharacter(simpleMap, a, b, m, 'z').should.equal('a')
            })
        })

        describe('decryptCharacter', () => {
            it('should decrypt a character that does not need to wrap around the end of the alphabet', () => {
                const simpleMap =  {'a': 0, 'b': 1}
                const m = numberOfKeys(simpleMap)
                const a = 1
                const b = 1
                decryptCharacter(simpleMap, a, b, m, 'b').should.equal('a')
            })
            it('should decrypt a character that needs to wrap around the end of the alphabet', () => {
                const simpleMap =  {'a': 0, 'z': 1}
                const m = numberOfKeys(simpleMap)
                const a = 1
                const b = 1
                decryptCharacter(simpleMap, a, b, m, 'a').should.equal('z')
            })
        })

        describe('affineCipher', () => {
            describe('encrypt', () => {

                it('should encrypt strings without wrapping the alphabet', () => {
                    const a = 1
                    const b = 1
                    const encrypt = affineCipher(englishAlphabet, a, b).encrypt
                    encrypt('abba').should.equal('bccb')
                })
                it('should encrypt strings that will wrap the alphabet', () => {
                    const a = 1
                    const b = 17
                    const encrypt = affineCipher(englishAlphabet, a, b).encrypt
                    encrypt('venom').should.equal('mvefd')
                })
            })

            describe('decrypt', () => {
                it('should decrypt strings without wrappig the alphabet', () => {
                    const a = 1
                    const b = 1
                    const decrypt= affineCipher(englishAlphabet, a, b).decrypt
                    decrypt('bccb').should.equal('abba')
                })

                it('should decrypt strings that will wrap the alphabet', () => {
                    const a = 1
                    const b = 17
                    const decrypt = affineCipher(englishAlphabet, a, b).decrypt
                    decrypt('mvefd').should.equal('venom')
                })
            })
        })
    })
    describe('should produce more complicated results "a" value > 1', () => {
        describe('encryptCharacter', () => {
            it('should encrypt a character that does not need to wrap around the end of the alphabet', () => {
                const simpleMap =  {'a': 0, 'b': 1, 'c': 2, 'd': 3, 'e': 4, 'f': 5, 'g': 6, 'h': 7}
                const m = numberOfKeys(simpleMap)
                const a = 3
                const b = 1
                encryptCharacter(simpleMap, a, b, m, 'c').should.equal('h')
            })
        })

        describe('decryptCharacter', () => {
            it('should decrypt a character that does not need to wrap around the end of the alphabet', () => {
                const simpleMap =  {'a': 0, 'b': 1, 'c': 2, 'd': 3, 'e': 4, 'f': 5, 'g': 6, 'h': 7}
                const m = numberOfKeys(simpleMap)
                const a = 3
                const b = 1
                decryptCharacter(simpleMap, a, b, m, 'h').should.equal('c')
            })
        })

        describe('affineCipher', () => {
            describe('encrypt', () => {

                it('should encrypt strings without wrapping the alphabet', () => {
                    const a = 3
                    const b = 1
                    const encrypt = affineCipher(englishAlphabet, a, b).encrypt
                    encrypt('abba').should.equal('beeb')
                })
                it('should encrypt strings that will wrap the alphabet', () => {
                })
            })

            describe('decrypt', () => {
                it('should decrypt strings without wrappig the alphabet', () => {
                    const a = 3
                    const b = 1
                    const decrypt= affineCipher(englishAlphabet, a, b).decrypt
                    decrypt('beeb').should.equal('abba')
                })

                it('should decrypt strings that will wrap the alphabet', () => {
                })
            })
        })
    })

})
