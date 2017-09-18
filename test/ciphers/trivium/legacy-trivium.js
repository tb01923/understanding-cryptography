// http://basecase.org/trivium/trivium.js


function string_to_points(str) {
    var points = [];
    for (var p = 0; p < str.length; p++) {
        points[p] = str.charCodeAt(p);
    }
    return points;
}

function points_to_string(points) {
    return String.fromCharCode.apply(null, points);
}

function bits_to_point(bits) {
    var point = 0;
    for (var i = 0; i < 16; i++) {
        if (bits[i])
            point += (2 << i) / 2;
    }
    return point;
}

function point_to_bits(point) {
    var bits = [];
    for (var i = 0; i < 16; i++) {
        bits.push((point >> i) % 2);
    }
    return bits;
}

function string_to_bits(s) {
    return points_to_bits(string_to_points(s));
}

function points_to_bits(pts) {
    bits = [];
    for (var p = 0; p < pts.length; p++) {
        bits = bits.concat(point_to_bits(pts[p]));
    }
    return bits;
}

const legacyKeyExpander = function(key){
    function repeat(e, n) {
        var r = [];
        for (var i=0; i<n; i++) { r.push(e); }
        return r;
    }
    key = string_to_bits(key).slice(0, 80);
    const legacyKey = repeat(0, 93 - key.length).concat(key)
    return legacyKey
}

module.exports = {legacyKeyExpander, points_to_string}