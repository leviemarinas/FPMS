exports.smart = function smart(strcode){
        var newcode = "";
        var intCounter =0,intStart=0,intEnd=0;
        var digit = require('./isNumber');
        for(intCounter = strcode.length-1;intCounter>=0;intCounter--){
            if(digit.isNumber(strcode.charCodeAt(intCounter))){
                intEnd = intCounter+1;
                while(digit.isNumber(strcode.charCodeAt(intCounter))){
                    intStart = intCounter;
                    intCounter--;
                }
                break;
            }
        }
        var strUnchangep1 = strcode.substr(0,intStart);
        var strUnchangep2 = strcode.substr(intEnd,strcode.length);
    
        var strChange = strcode.substring(intStart,intEnd);
    
        console.log('p1:'+ strUnchangep1);
        console.log('p2:'+ strUnchangep2);
        console.log('changed:'+ strChange);
    
        if(!strChange==""){
            var intChange = Number(strChange);
            console.log('int:'+ intChange);
            intChange++;
    
            var strIntChange = String(intChange);
            var strnewChange = "";
            if(strIntChange.length != strChange.length){
                intCounter = 0;
    
                while(strChange.length > (strnewChange.length + strIntChange.length)){
                    strnewChange = strnewChange.concat("0");
                }
            }
            strnewChange = strnewChange.concat(strIntChange);
    
            newcode = strUnchangep1 + strnewChange + strUnchangep2;
    
            console.log("intchange++:" + intChange);
            console.log("strnewChanged:" + strnewChange);
        }
        console.log("stroldcode: " +strcode);
        console.log('strNewcode: ' +newcode);
        strReturnCode = newcode;
        return strReturnCode;
    }
