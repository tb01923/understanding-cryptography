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

const {streamCipher} = require('./ciphers/stream-cipher')

const key = [0,1,0]
const encrypt = streamCipher(key)
const decrypt = streamCipher(key)

const c = readStreamFromString("A message from me\n")
    .pipe(encrypt)
    //.pipe(decrypt) ;

let string = ''
c.on('data', part => string += part)
c.on('end', () => console.log(string) )

// const { ByteKeyRing } = require('./ciphers/cipher-helpers/byte-key-ring')
// const byteKeyRing = ByteKeyRing(8, [0])
//
// const n = byteKeyRing.next()
// const v = n.value