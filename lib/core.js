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
}
