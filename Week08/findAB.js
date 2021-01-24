function findAB(str) {
    let findA = false;
    for (const iterator of str) {
        if(iterator === "a") {
            findA = true;
        } else if(findA && iterator === "b") {
            return true;
        } else {
            findA = false;
        }
    }

    return false;
}

console.log(findAB("ab"))