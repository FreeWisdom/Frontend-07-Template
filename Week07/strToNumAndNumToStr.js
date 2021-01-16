const numberConversionTypeMap = {
  2: {
    regular: /^(0b)[0-1]+$/gi,
    prefix: "0b"
  },
  8: {
    regular: /^(0o)[0-7]+$/gi,
    prefix: "0o"
  },
  10: {
    regular: /(^\d+$)|(^\d+\.\d+$)|(^\d+[e\+]\d+$)/gi,
    prefix: ""
  },
  16: {
    regular: /^(0x)([\da-f])+$/gi,
    prefix: "0x"
  }
}

function numberToString(number, conversionType) {
    if(numberConversionTypeMap[conversionType]) {
        return numberConversionTypeMap[conversionType].prefix + number.toString(conversionType)
    }
    return NaN;
}

function stringToNumber(string) {
    for (const conversionType in numberConversionTypeMap) {
        //识别字符串所代表数字的进制类型
        if (numberConversionTypeMap[conversionType].regular.test(string)) {
            if(conversionType === "10") {
                return Number(string)
            }
            return Number(parseInt(string.slice(2), conversionType))
        }
        return NaN;
    }
}

// numberToString(0x999, 16);
console.log(stringToNumber("0x1f"))