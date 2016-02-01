
(function() {

  var startStop = d3.select('.start-stop')
        .on('click', startStop)

    , showFound = d3.select('.show-found')
        .on('click', showPrimes)

    , showImage = d3.select('.show-image')
        .on('click', drawImage)

    , canvas = d3.select('canvas')

    , stateValue = d3.select('.state-value')

    , enumeratedValue = d3.select('.enumerated-value')

    , primesValue = d3.select('.primes-value')

    , ranValue = d3.select('.ran-value')

    , totalTimeValue = d3.select('.total-time-value')

    , maxValue = d3.select('.max-value')

    , minValue = d3.select('.min-value')

    , worker = new Worker('worker.js')

    , number = enumerated()

    , isWorking = false

    , handler

    , durationCalc

    , lastStart

  worker.onmessage = onResult

  setText(enumeratedValue, enumerated())
  setText(primesValue, primes())
  setText(ranValue, ranTimes())
  showTotalDuration()
  showMinDuration()
  showMaxDuration()

  function onResult(res) {
    if (res.data) setText(primesValue, incPrimes())

    setText(enumeratedValue, incEnumerated())

    var tmp = new Date()
    addTotalTime(tmp - durationCalc)
    durationCalc = tmp

    showTotalDuration()
  }

  function setText(source, text) {
    source.text(text)
  }

  function showTotalDuration() {
    setText(totalTimeValue, formatDuration(totalTime()))
  }

  function showMinDuration() {
    setText(minValue, formatDuration(minTime()))
  }

  function showMaxDuration() {
    setText(maxValue, formatDuration(maxTime()))
  }

  function formatDuration(time) {
    var duration = moment.duration(time)
      , str = ''

    append('years', 'y.')
    append('months', 'mnth.')
    append('days', 'd.')
    append('hours', 'h.')
    append('minutes', 'm.')
    append('seconds', 's.')

    return str.trim()

    function append(method, preffix) {
      if (R.func(method, duration)) str += R.func(method, duration) + preffix + ' '
    }
  }

  function startStop(d, i) {
    R.ifElse(
      R.eq(R.F())
    , start
    , stop
    )(isWorking)

    function start() {
      handler = setInterval(checkNumber, 50)
      setText(startStop, 'Stop')
      isWorking = true
      setText(stateValue, 'running')
      setText(ranValue, incRanTimes())
      durationCalc = lastStart = new Date()

      function checkNumber() {
        postNumber(number++)

        function postNumber(number) {
          worker.postMessage(number)
        }
      }
    }

    function stop() {
      var stopTime = new Date()
        , lastDuration = stopTime - lastStart
        , min = R.min([minTime(), lastDuration])
        , max = R.max([maxTime(), lastDuration])

      if (!minTime()) min = lastDuration

      clearInterval(handler)
      setText(startStop, 'Start')
      setText(stateValue, 'not running')
      isWorking = false

      addTotalTime(stopTime - durationCalc)

      showTotalDuration()

      minTime(min < 1000 ? 1000 : min)
      maxTime(max)

      showMinDuration()
      showMaxDuration()
    }
  }

  function showPrimes() {
    readPrimes(draw)

    function draw(primes) {
      d3.select('.table-container')
        .html('<table class="primes-table"><thead><tr><th>Key</th><th>Value</th></tr></thead><tbody></tbody></table>')

      $('.primes-table').DataTable({
        'data': primes
      , 'pagingType': 'full_numbers'
      , 'columns': [
        {
          'data': 'key'
        }
      , {
          'data': 'value'
        }
      ]
      })
    }
  }

  function drawImage() {
    readPrimes(draw)

    function draw(primes) {
      var sqrt = 1 +
        Math.floor(
          Math.sqrt(
            R.prop('value',
              R.maxBy(
                R.prop('value')
              , primes
              )
            )
          )
        )

      canvas
        .attr('width', sqrt)
        .attr('height', sqrt)

      R.forEach(function(prime) {
        drawPixel((prime.value % sqrt), Math.floor((prime.value / sqrt)))
      }, primes)

      function drawPixel(x, y) {
        var ctx = canvas
          .node()
          .getContext('2d')

        ctx.moveTo(x, y)

        ctx.lineTo(x + 1, y + 1)
        ctx.stroke()
      }
    }
  }
})()