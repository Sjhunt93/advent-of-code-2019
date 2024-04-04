import { readFileSync } from 'fs';
import { assert } from 'console';

const file = readFileSync('solutions/day7.dat', 'utf-8');
const ins = file.split(',').map(x => parseInt(x));

const POSITION_MODE = 0;
const IMMEDIATE_MODE = 1;
const INSTRUCTION_SIZE = [0, 4, 4, 2, 2, 0, 0, 4, 4];

const solve = (numbers: number[], input_a: number, input_b: number) => {
    var insPtr = 0;
    var output = 0;
    var first = true;
    while (numbers[insPtr] != 99) {
        const opcode = parseInt(numbers[insPtr].toString().slice(-1));
        const modes = Math.floor(numbers[insPtr] / 100);
        const c = modes % 10;
        const b = Math.floor(modes / 10) % 10;
        const a = Math.floor(modes / 100);
        console.log(numbers[insPtr], ' # ', opcode, ' -- ', c, b, a);
        // console.log(numbers)
        const param1 = c == POSITION_MODE ? numbers[numbers[insPtr + 1]] : numbers[insPtr + 1];
        const param2 = b == POSITION_MODE ? numbers[numbers[insPtr + 2]] : numbers[insPtr + 2];
        const des = numbers[insPtr + 3];
        console.log(param1, param2, des)
        switch (opcode) {
            case 1:
                numbers[des] = param1 + param2;
                break;
            case 2:
                numbers[des] = param1 * param2;
                break;
            case 3:
                numbers[numbers[insPtr + 1]] = first ? input_a : input_b;
                first = false;
                break;
            case 4:
                output = numbers[numbers[insPtr + 1]];
                return output;
            case 5:
                insPtr = param1 != 0 ? param2 : insPtr + 3;
                break;
            case 6:
                insPtr = param1 == 0 ? param2 : insPtr + 3;
                break;
            case 7:
                numbers[des] = param1 < param2 ? 1 : 0;
                break;
            case 8:
                numbers[des] = param1 == param2 ? 1 : 0;
                break;

            default:
                break;
        }
        if (!(opcode == 5 || opcode == 6)) {
            insPtr += INSTRUCTION_SIZE[opcode];
        }
    }
    return output;
};

// 43210

var max = 0;

for (let index = 0; index < 44444; index++) {
    const p1 = index%10;
    const p2 = Math.floor(((index%100) / 10));
    const p3 = Math.floor(((index%1000) / 100));
    const p4 = Math.floor(((index%10000) / 1000));
    const p5 = Math.floor(index / 10000);
    const mySet = new Set([p1, p2, p3, p4, p5])
    if (mySet.size == 5 && ! (mySet.has(5) || mySet.has(6) || mySet.has(7) || mySet.has(8) || mySet.has(9))) {
        console.log(mySet);
        const a = solve([...ins], p1, 0);
        const b = solve([...ins], p2, a);
        const c = solve([...ins], p3, b);
        const d = solve([...ins], p4, c);
        const e = solve([...ins], p5, d);
        // const p2 = solve([...ins], 5);
        max = e > max ? e : max;
    }

}
console.log(max)

// var e = 0;

// const a = solve([...ins], 9, e);
// console.log(a);
// const b = solve([...ins], 8, a);
// const c = solve([...ins], 7, b);
// const d = solve([...ins], 6, c);
// e = solve([...ins], 5, d);
// console.log(e)