JST = {};

(function(){
  JST.system_time = function() {
    if(typeof window.performance !== "undefined" &&!(window.performance.now==null)) {
       return performance.now();
  }
    if(typeof process!== "undefined" &&!(process.hrtime==null)){
      var t=process.hrtime();
      return(t[0]*1E9+t[1])/1E6;
    }
    return(new Date).getTime();
  };
  
  
  JST.time = function(f) {
    var start = JST.system_time();
    f();
    var elapsed = JST.system_time() - start;
    return elapsed.toFixed(6) + " msec"
  };
  JST.benchmark = function(iterations, f) {
    var start = JST.system_time();
    for (var i = 0; i < iterations; i++) {
      f();
    }
    var end = JST.system_time();
    return "Elapsed time: " + (end - start) + " msec";
  };
    
  JST.memoize = function(f) {
      var memo = {};
      return function(n) {
          if (memo.hasOwnProperty(n)) {
              return memo[n];
          }
          var result = f(n);
          memo[n] = result;
          return result;
      };
  };
  
  JST.permutations = function(arr){
    var permArr = [],
        usedChars = [];
  
    function permute(input) {
      var i, ch;
      for (i = 0; i < input.length; i++) {
        ch = input.splice(i, 1)[0];
        usedChars.push(ch);
        if (input.length == 0) {
          permArr.push(usedChars.slice());
        }
        permute(input);
        input.splice(i, 0, ch);
        usedChars.pop();
      }
      return permArr;
    };
    return permute(arr);
  };
  
  var extremumBy = function(pluck, extremum, arr) {
    return arr.reduce(function(best, next) {
      var pair = [pluck(next), next];
      if (best === null) {
         return pair;
      }
      if (extremum(best[0], pair[0]) === best[0]) {
         return best;
      }
      return pair;
    }, null)[1];
  };
  
  JST.minBy = function(fn, arr) {
    return extremumBy(fn, Math.min, arr);
  };
  
  JST.maxBy = function(fn, arr) {
    return extremumBy(fn, Math.max, arr);
  };
  
  JST.flattenObject = function(obj, prefix = '') {
  return Object.entries(obj).reduce(
    function(acc, [k, v]) {
      if (typeof(v) == "object") {
        return Object.assign(acc, JST.flattenObject(v, prefix + k + "."));
      }
      acc[prefix + k]  = v;
      return acc;
    },
    {});
}
}());
