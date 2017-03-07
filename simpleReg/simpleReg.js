function SimpleRegEngine(){
    this.reg;
    this.str;
    this.startChart;
    this.startStatus;
    this.dotLength;
    this.metaSet = {"*":"", ".":""};
}

// 去掉初始头部的"."或者"*"元字符
SimpleRegEngine.prototype.setStartChartAndStatus = function(){
    var i, reg = this.reg;
    this.dotLength = 0;

    for (i = 0; i < reg.length; i++){
        if (this.isMetaChar(reg.charAt(i))){
            if ((reg.charAt(i)) == "*"){
                this.reg = this.reg.replace("*","");
            }
            else if ((reg.charAt(i)) == "."){
                this.dotLength += 1;
                this.reg = this.reg.replace(".","")
            }
        }
        else{
            this.startChart = reg.charAt(i);
            break;
        }
    }
}


SimpleRegEngine.prototype.isMetaChar = function(char){
   return char in this.metaSet ? true : false;
}

//去掉尾部的"*"元字符
SimpleRegEngine.prototype.trim = function(){
    var i;
    for(i = this.reg.length; i >= 0 ; i--){
        if (this.reg.charAt(i) == '*'){
            this.reg = this.reg.subString(0, this.reg.length - 1);
        }
    }
}

SimpleRegEngine.prototype.match = function(str,reg){

    var strIndex, result;

    if (!str || !reg) return false;

    this.reg = reg;
    this.str = str
    this.setStartChartAndStatus();
    
    if ((!this.reg && this.dotLength <= str.length) || (!this.reg && reg.dotLength == 0)) return true;

    for (strIndex = this.dotLength; strIndex < this.str.length; strIndex++){
        if (this.str.charAt(strIndex) == this.startChart){
            // 如果和正则的第一个字符匹配上，则开始匹配
            result = this.beginMatch(strIndex);
            if (result !== false){
                return true;
            }
        }
    }
    return false;
}

SimpleRegEngine.prototype.beginMatch = function(strIndex){
    var regIndex, allFlag, i;
    i = strIndex + 1;

    for (regIndex = 1; regIndex < this.reg.length;regIndex++){
        switch (this.reg.charAt(regIndex)){
            case "." : 
                if (!this.str.charAt(i)){
                    return false;
                }
                i++;
                break;
            case "*" :
                allFlag = true;
                break;
            default:
                if (allFlag == true){
                    for (i; i < this.str.length; i++){
                        if (this.str.charAt(i) == this.reg.charAt(regIndex)){
                            allFlag = false;
                            i++;
                            break;
                        }
                    }

                    if (allFlag == true){
                        return false;
                    }
                }
                else{
                    if (this.str.charAt(i) != this.reg.charAt(regIndex)){
                        return false
                    }else{
                        i++;
                    }
                }
        }
    }
}
