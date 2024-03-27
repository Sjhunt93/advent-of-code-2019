import { readFileSync } from 'fs';
import { assert } from "console";


const start = "307237";
const end = 769058;

let characters: number[] = start.split("").map(x => parseInt(x));
console.log(characters);


const isValid = (characters: number[]) => {
    var flag = false;
    for (var i = 1; i < 6; i++) {
        if (characters[i] < characters[i-1]) {
            return false;
        }
        if (characters[i] == characters[i-1]) {
            flag = true;
        }
    }
    return flag;

}

const isValid2 = (characters: number[]) => {
    let res: number[] = new Array(10).fill(0);
    var flag = false;
    res[characters[0]]++;
    for (var i = 1; i < 6; i++) {
        if (characters[i] < characters[i-1]) {
            return false;
        }
        res[characters[i]] ++;

    }
    for (let element of res) {
        if (element == 2) {
            return true;
        }
    }
    return flag;

}

var c1 = 0;
var c2 = 0;

for (var i = parseInt(start); i < end; i++) {
    const characters: number[] = i.toString().split("").map(x => parseInt(x));
    c1 += isValid(characters) ? 1 : 0;
    c2 += isValid2(characters) ? 1 : 0;
}
console.log(c1, c2);

