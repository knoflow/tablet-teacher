Function.prototype.bind = Function.prototype.bind || function(fixThis) {
  var func = this  
  return function() {
    return func.apply(fixThis, arguments)
  }
}


function bindLate(funcName, fixThis) { // instead of bind
  return function() {
    return fixThis[funcName].apply(fixThis, arguments)
  }
}