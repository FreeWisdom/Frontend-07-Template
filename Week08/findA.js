function findA(str) {
    for (let c of str) {
        if(c === "a")
            return true;
    }
    return false;
};

console.log(findA("app"))
