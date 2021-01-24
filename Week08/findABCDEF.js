/**
 * 普通查询 
**/
// function findABCDEF(str) {
//     let findA = false;
//     let findB = false;
//     let findC = false;
//     let findD = false;
//     let findE = false;
//     for (const iterator of str) {
//         if(iterator === "a") {
//             findA = true;
//         } else if(findA && iterator === "b") {
//             findB = true;
//         } else if(findB && iterator === "c") {
//             findC = true;
//         } else if(findC && iterator === "d") {
//             findD = true;
//         } else if(findD && iterator === "e") {
//             return true
//         } else if(findE && iterator === "f") {
//             findE = true
//         } else {
//             findA = findB = findC = findD = findE = false;
//         }
//     }
//     return false;
// }


/**
 * 状态机查询
 */
function findABCDEF(str) {
    let state = start;
    for (const iterator of str) {
        state = state(iterator);
        console.log(state)
    }
    return state === end;
}

function start(iterator) {
    if(iterator === "a") {
        return findA;
    } else {
        return start;
    }
}

function findA(iterator) {
    if(iterator === "b") {
        return findB;
    } else {
        return start(iterator);
    }
}

function findB(iterator) {
    if(iterator === "c") {
        return findC;
    } else {
        return start(iterator);
    }
}

function findC(iterator) {
    if(iterator === "d") {
        return findD;
    } else {
        return start(iterator);
    }
}

function findD(iterator) {
    if(iterator === "e") {
        return findE;
    } else {
        return start(iterator);
    }
}

function findE(iterator) {
    if(iterator === "f") {
        return end();
    } else {
        return start(iterator);
    }
}

function end(iterator) {
    return end;
}

console.log(findABCDEF("ababcdef gr t"))