(function() {

  function openDB(success) {
    var request = indexedDB.open("html5", 1)
      , db

    request.onupgradeneeded = function(e) {
      db = request.result
      if (e.oldVersion < 1)
        db
          .createObjectStore('primes', { keyPath: 'key' })
          .createIndex('keyIndex', 'key', { unique: true })
    }

    request.onsuccess = function(ev) {
      db = request.result
      success(db)
      db.onerror = R.partial(console.log.bind, console, 'db error')
    }
  }

  savePrime = function(prime) {
    openDB(save)

    function save(db) {
      db.transaction(['primes'], 'readwrite')
        .objectStore('primes')
        .add(prime)
    }
  }

  readPrimes = function(callback) {
    openDB(read)

    function read(db) {
      db.transaction(['primes'], 'readonly')
        .objectStore('primes')
        .openCursor()
        .onsuccess = readCursor

      var result = []

      function readCursor(e) {
        var cursor = e.target.result

        if (!cursor) callback(result)
        else {
          result.push(cursor.value)
          cursor.continue()
        }
      }
    }
  }

  lookupPrime = function(prime, callback) {
    openDB(lookup)

    function lookup(db) {
      db.transaction(['primes'], 'readonly')
        .objectStore('primes')
        .get(prime)
        .onsuccess = R.compose(callback, R.prop('result'), R.prop('target'))
    }
  }
})()