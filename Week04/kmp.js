//主串  aabaabaac     i

//序号  012345
//模串  aabaac        j
//奈斯  001012
function kmpMatch(source, pattern){
    const next = buildNext(pattern);

    let i = 0;  //source的位置
    let j = 0;  //pattern的位置

    while (i < source.length) {

        if(source[i] === pattern[j]){
            ++ i;
            ++ j;
        } else {
            if(j > 0){
                j = next[j];
            } else {
                ++ i
            }
        }

        //自增之后再判断，排除结尾时相同的判断错误
        if(j === pattern.length)
            return true;
    }
    return false;
}



//序号  012345
//模串  aabaaf
//奈斯  001012

//buildNext中的while逻辑实例推导：
//----------------------------------------------------------------------------
//  i   j           if                                     next[]
//----------------------------------------------------------------------------
//  1   0   p[1]===p[0];        ++i=2,++j=1,next[2]=1;  next[0, 0, 1, 0, 0, 0];
//  2   1   p[2]!==p[1],j>0;    j=next[1]=0;            next[0, 0, 1, 0, 0, 0];
//  2   0   p[2]!==p[0],j===0;  ++i=3;                  next[0, 0, 1, 0, 0, 0];
//  3   0   p[3]===p[0];        ++i=4,++j=1,next[4]=1;  next[0, 0, 1, 0, 1, 0];
//  4   1   p[4]===p[1];        ++i=5,++j=2,next[5]=2;  next[0, 0, 1, 0, 1, 2];
//  5   2   p[5]!==p[2],j>0;    j=next[2]=1;            next[0, 0, 1, 0, 1, 2];
//  5   1   p[5]!==p[1],j>0;    j=next[1]=0;            next[0, 0, 1, 0, 1, 2];
//  5   0   p[5]!==p[0],j===0;  ++i=6;                  退出while()


function buildNext(pattern){
    let i = 1;      //自重复串的开始位置     //后缀的末尾
    let j = 0;      //已重复的字数          //即是前缀的末尾，++j后又是最长公共前缀后缀的个数
    let next = new Array(pattern.length).fill(0);       //初始化next数组均为0。即next[0, 0, 0, 0, 0, 0]注：0的位置一定为0；

    while (i < pattern.length) {//i=1,2,3,4,5

        if(pattern[j] === pattern[i]){//若p[i] === p[j]，则为next[i]赋值为++j。原因见第8行注释；

            ++ j;
            ++ i;
            next[i] = j;

        } else {//若p[i] !== p[j] && j > 0，则需要匹配i与j前一个数，根据next数组，可将j前一个数得到。

            if(j > 0){//j > 0时：避免j === 0时出现， j = table[0]

                j = next[j];
            
            } else {//j === 0时：则++ i往前匹配
                ++ i;
            }

        }
    }
    
    return next;
}

console.log(kmpMatch("aabaaac", "aabaaac"))