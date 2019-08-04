//https://www.linkedin.com/pulse/reduce-ing-javascript-native-implementation-reduce-friends-todd-brown
const bind = (f, x) => f.bind(null, x)

// head :: [a] -> a
const head = (xs) => xs[0]

// tail :: [a] -> [a]
const tail = (xs) => xs.slice(1)

// curry :: (a -> ...y -> z)
const curry = (f) =>
    (f.length != 0) ?
        (...xs) => curry(xs.reduce(bind, f)) :
        f()

// reduce :: (a -> b -> a) -> a -> [b] -> a
const reduce = curry((f, agg, xs) =>
    (xs.length) ?
        reduce(f, f(agg, head(xs)), tail(xs)) :
        agg
)

// pipe :: [(a -> b), (b -> c), ...(y -> z)] -> a -> z
const pipe = curry((xs, a) =>
    reduce(
        (g, f) => f(g)
        , a
        , xs)
)

// find :: {k: v}, v -> k
const findKeyByValue = (obj, value) =>
    Object.keys(obj).filter(
        (key) => obj[key] === value
    )[0]

// append :: [a] -> a -> [a]
const append = curry((xs, x) =>
    xs.concat([x])
)

// appendingCombiner :: (a -> b) -> ([b], a) -> [b]
const transformingAppender = f =>
    (agg, x) =>
        append(agg, f(x))

// map :: (a -> b) -> [a] -> [b]
const map = curry((f, xs) =>
    reduce(
        transformingAppender(f)
        , []
        , xs))

const flatten = xs =>
    reduce(
        (agg, x) => agg.concat(x)
        , []
        , xs)

module.exports  = {
    reduce, curry, pipe, findKeyByValue, head, tail, map, flatten
}