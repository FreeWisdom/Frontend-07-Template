function findABCABX(str) {
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
    if(iterator === "a") {
        return findA2;
    } else {
        return start(iterator);
    }
}

function findA2(iterator) {
    if(iterator === "b") {
        return findB2;
    } else {
        return start(iterator);
    }
}

function findB2(iterator) {
    if(iterator === "x") {
        return end;
    } else {
        return findB(iterator);
    }
}

function end(iterator) {
    return end;
}

console.log(findABCABX("abcabca bxabx"))