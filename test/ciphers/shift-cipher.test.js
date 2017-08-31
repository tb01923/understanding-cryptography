const mocha = require('mocha')
    , chai = require('chai')
    , should = chai.should() ;

const { shiftCipher, encryptCharacter, decryptCharacter } = require('../../ciphers/shift-cipher')
const { englishAlphabet } = require('../../ciphers/alphabet-map')
const { numberOfKeys } = require('../../helpers/common-bits')

describe('ciphers/shift-cipher', () => {

    describe('encryptCharacter', () => {
        it('should encrypt a character that does not need to wrap around the end of the alphabet', () => {
            const simpleMap =  {'a': 0, 'b': 1}
            const m = numberOfKeys(simpleMap)
            const k = 1
            encryptCharacter(simpleMap, k, m, 'a').should.equal('b')
        })
        it('should encrypt a character that needs to wrap around the end of the alphabet', () => {
            const simpleMap =  {'a': 0, 'z': 1}
            const m = numberOfKeys(simpleMap)
            const k = 1
            encryptCharacter(simpleMap, k, m, 'z').should.equal('a')
        })
    })

    describe('decryptCharacter', () => {
        it('should decrypt a character that does not need to wrap around the end of the alphabet', () => {
            const simpleMap =  {'a': 0, 'b': 1}
            const m = numberOfKeys(simpleMap)
            const k = 1
            decryptCharacter(simpleMap, k, m, 'b').should.equal('a')
        })
        it('should decrypt a character that needs to wrap around the end of the alphabet', () => {
            const simpleMap =  {'a': 0, 'z': 1}
            const m = numberOfKeys(simpleMap)
            const k = 1
            decryptCharacter(simpleMap, k, m, 'a').should.equal('z')
        })
    })

    describe('shiftCipher', () => {
        describe('encrypt', () => {

            it('should encrypt strings without wrapping the alphabet', () => {
                const encrypt = shiftCipher(englishAlphabet, 1).encrypt
                encrypt('abba').should.equal('bccb')
            })
            it('should encrypt strings that will wrap the alphabet', () => {
                const encrypt = shiftCipher(englishAlphabet, 17).encrypt
                encrypt('venom').should.equal('mvefd')
            })
        })

        describe('decrypt', () => {
            it('should decrypt strings without wrappig the alphabet', () => {
                const decrypt= shiftCipher(englishAlphabet, 1).decrypt
                decrypt('bccb').should.equal('abba')
            })

            it('should decrypt strings that will wrap the alphabet', () => {
                const decrypt = shiftCipher(englishAlphabet, 17).decrypt
                decrypt('mvefd').should.equal('venom')
            })
        })
    })
})
