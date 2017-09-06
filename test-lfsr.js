/**
 * Created by tbrown on 9/6/17.
 */
const {ExternalLfsrByteRing} = require('./prng/external-lfsr-byte-ring')
const ring = ExternalLfsrByteRing(8, [1,0,1])

for(let i =0; i < 7; i++) {
    console.log(ring.next().value)
}
