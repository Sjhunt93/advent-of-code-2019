import { readFileSync } from 'fs';
import { assert } from "console";


const file = readFileSync('solutions/day2.dat', 'utf-8');
const numbers = file.split(",").map(x => parseInt(x));

const solve = (values: number[], add1: number, add2: number ) => {
    var i = 0;
    values[1] = add1;
    values[2] = add2;
    while (values[i] != 99) {
        if (values[i] == 1 || values[i] == 2) {
            const a = values[i+1];
            const b = values[i+2];
            const des = values[i+3];
            values[des] = (values[i] == 1) ? values[a] + values[b] : values[a] * values[b];
        }
        i += 4;
    }
    return values[0];
}

// part 1
console.log(solve(numbers.slice(), 12, 2))

// part 2
for (let i = 0; i <= 99; i++) {
    for (let j = 0; j <= 99; j++) {
        if (solve(numbers.slice(), i, j) == 19690720) {
            console.log(i, j, i*100 + j);
        }
    }
}
