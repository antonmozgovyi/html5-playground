(function() {

  importScripts('http://d3js.org/d3.v3.min.js')
  importScripts('//cdnjs.cloudflare.com/ajax/libs/ramda/0.10.0/ramda.min.js')
  importScripts('db.js')

  self.onmessage = function(e) {
    var n = e.data

      , sqrt = Math.floor(Math.sqrt(n)) + 1

    lookupPrime(n, process)

    function process(prime) {
      if (prime) return result(true)

      if (R.eq(R.mathMod(n, 2), 0)) return result(R.eq(n, 2))

      result(
        R.all(
          R.compose(
            R.not(R.eq(0))
          , R.mathMod(n)
          )
        , d3.range(3, sqrt, 2)
        )
      )

      function result(isPrime) {
        if (isPrime) savePrime({ key: n, value: n })
        self.postMessage(isPrime)
      }
    }
  }
})()