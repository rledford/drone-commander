
export function randInRange(min, max){
    return Math.random() * (max - min) + min;
}
export function randIntInRange(min, max){
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
export function randInGroup(group){
    return group[Math.floor(Math.random()*group.length)];
}

