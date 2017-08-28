//https://www.linkedin.com/pulse/reduce-ing-javascript-native-implementation-reduce-friends-todd-brown
const bind = (f, x) => f.bind(null, x)

// curry :: (a -> ...y -> z)
const curry = (f) =>
    (f.length != 0) ?
        (...xs) => curry(xs.reduce(bind, f)) :
        f()

// head :: [a] -> a
const head = (xs) => xs[0]

// tail :: [a] -> [a]
const tail = (xs) => xs.slice(1)

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

// conditionalCombiner :: ((a -> bool) -> ([a], a) -> [a]
const firstConditionalCombiner = f =>
    (agg, x) =>
        (f(x)) ?
            agg | x :
            agg

// find :: {k: v}, v -> k
const find = (obj, value) =>
    Object.keys(obj).filter(
        (key) => obj[key] === value
    )[0]

module.exports  = {
    reduce, curry, pipe, find
}