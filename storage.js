(function() {

  incPrimes = function () {
    return (localStorage.primes = primes() + 1)
  }

  primes = function() {
    return +localStorage.primes || 0
  }

  incEnumerated = function() {
    return (localStorage.enumerated = enumerated() + 1)
  }

  enumerated = function() {
    return +localStorage.enumerated || 0
  }

  incRanTimes = function() {
    return (localStorage.ranTimes = ranTimes() + 1)
  }

  ranTimes = function() {
    return +localStorage.ranTimes || 0
  }

  totalTime = function() {
    return +localStorage.totalTime || 0
  }

  addTotalTime = function(time) {
    return (localStorage.totalTime = totalTime() + time)
  }

  minTime = function(value) {
    if (!arguments.length) return +localStorage.minTime || 0

    return (localStorage.minTime = value)
  }

  maxTime = function(value) {
    if (!arguments.length) return +localStorage.maxTime || 0

    return (localStorage.maxTime = value)
  }

})()