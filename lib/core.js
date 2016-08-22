JST = {}
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
