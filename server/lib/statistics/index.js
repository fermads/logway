class Statistics {

  median(values) {
      // values.sort(function(a,b) { return a - b; });
      var half = Math.floor(values.length / 2)

      if(values.length % 2)
          return values[half]
      else
          return (values[half-1] + values[half]) / 2.0
  }

  insert(value, array, startVal, endVal) { // binary insert
    var length = array.length;
    var start = typeof(startVal) != 'undefined' ? startVal : 0
    var end = typeof(endVal) != 'undefined' ? endVal : length - 1
    var m = start + Math.floor((end - start)/2)

    if(length === 0)
      return array.push(value)

    if(value > array[end])
      return array.splice(end + 1, 0, value)

    if(value <= array[start])
      return array.splice(start, 0, value)

    if(start >= end)
      return

    if(value <= array[m])
      return this.insert(value, array, start, m - 1)

    if(value > array[m])
      return this.insert(value, array, m + 1, end)
  }

  calculate(a) {
    var t = a.length
    var r = {
      mean: 0,
      variance: 0,
      deviation: 0,
      sum: 0,
      lower: Infinity,
      upper: -Infinity,
      size: t
    };

    for(var m, s = 0, l = t; l--; s += a[l]) {
      if(a[l] < r.lower)
        r.lower = a[l]
      if(a[l] > r.upper)
        r.upper = a[l]
    }

    r.sum = s;

    for(m = r.mean = s / t, l = t, s = 0; l--; s += Math.pow(a[l] - m, 2))

    r.deviation = Math.sqrt(r.variance = s / t)
    r.median = this.median(a)

    return r
  }
}

module.exports = Statistics
