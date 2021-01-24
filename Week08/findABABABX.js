function findABABABX(str) {
    let state = start;
    for (const iterator of str) {
        state = state(iterator);
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
    if(iterator === "a") {
        return findA3;
    } else {
        return start(iterator);
    }
}

function findA3(iterator) {
    if(iterator === "b") {
        return findB3;
    } else {
        return start(iterator);
    }
}

function findB3(iterator) {
    if(iterator === "x") {
        return end;
    } else {
        return findB2(iterator);
    }
}

function end() {
    return end;
}

console.log(findABABABX("ababab xbx"))