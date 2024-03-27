import { readFileSync } from 'fs';
import { assert } from 'console';

const file = readFileSync('solutions/day5.dat', 'utf-8');
const ins = file.split(',').map(x => parseInt(x));

const POSITION_MODE = 0;
const IMMEDIATE_MODE = 1;
const INSTRUCTION_SIZE = [0, 4, 4, 2, 2, 0, 0, 4, 4];

const solve = (numbers: number[], input: number) => {
    var insPtr = 0;
    var output = 0;

    while (numbers[insPtr] != 99) {
        const opcode = parseInt(numbers[insPtr].toString().slice(-1));
        const modes = Math.floor(numbers[insPtr] / 100);
        const c = modes % 10;
        const b = Math.floor(modes / 10) % 10;
        const a = Math.floor(modes / 100);
        console.log(numbers[insPtr], ' # ', opcode, ' -- ', c, b, a);

        const param1 = c == POSITION_MODE ? numbers[numbers[insPtr + 1]] : numbers[insPtr + 1];
        const param2 = b == POSITION_MODE ? numbers[numbers[insPtr + 2]] : numbers[insPtr + 2];
        const des = numbers[insPtr + 3];
        switch (opcode) {
            case 1:
                numbers[des] = param1 + param2;
                break;
            case 2:
                numbers[des] = param1 * param2;
                break;
            case 3:
                numbers[numbers[insPtr + 1]] = input;
                break;
            case 4:
                output = numbers[numbers[insPtr + 1]];
                break;
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
const p1 = solve([...ins], 1);
const p2 = solve([...ins], 5);
console.log(p1, p2)
