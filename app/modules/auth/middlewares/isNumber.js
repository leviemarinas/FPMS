exports.isNumber = function isNumber(n){
    var charCodeZero = "0".charCodeAt(0);
    var charCodeNine = "9".charCodeAt(0);
    return(n >= charCodeZero && n <=charCodeNine)
}