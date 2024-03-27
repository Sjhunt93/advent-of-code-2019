// npx ts-node
import * as fs from 'fs';
import * as readline from 'readline';
import { readFileSync } from 'fs';
import { assert } from "console";




const formula = (mass: number) => {
    return Math.floor(mass / 3) - 2;
}
assert(formula(12) == 2);
assert(formula(14) == 2);
assert(formula(1969) == 654);


const formula2 = (mass: number): number => {
    const a = Math.floor(mass / 3) - 2;
    return (a > 0) ? a + formula2(a) : 0;
}
console.log(formula2(100756));
assert(formula2(100756) == 50346);

// part 1
console.log(readFileSync('solutions/day1.dat', 'utf-8').split('\n').map(num => formula(parseInt(num))).reduce((acc, num) => acc + num, 0));
// part 2
console.log(readFileSync('solutions/day1.dat', 'utf-8').split('\n').map(num => formula2(parseInt(num))).reduce((acc, num) => acc + num, 0));