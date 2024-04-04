import { readFileSync } from 'fs';
import { assert } from 'console';

const file = readFileSync('solutions/day7.dat', 'utf-8');
const ins = file.split(',').map(x => parseInt(x));

const POSITION_MODE = 0;
const IMMEDIATE_MODE = 1;
const INSTRUCTION_SIZE = [0, 4, 4, 2, 2, 0, 0, 4, 4];

class CPU {
    // private rom: number[];
    private ram: number[]
    private insPtr: number;
    public A: number;
    public B: number;
    public output: number;
    public flag99: boolean;
    public init: boolean;

    constructor(rom: number[], a: number, b: number) {
        this.ram = [...rom];
        this.insPtr = 0;
        this.A = a;
        this.B = b;
        this.output = 0;
        this.flag99 = false;
        this.init = true;
    }

    run(): number {
        
        while (this.ram[this.insPtr] != 99) {
            const opcode = parseInt(this.ram[this.insPtr].toString().slice(-1));
            const modes = Math.floor(this.ram[this.insPtr] / 100);
            const c = modes % 10;
            const b = Math.floor(modes / 10) % 10;
            const a = Math.floor(modes / 100);
            console.log(this.ram[this.insPtr], ' # ', opcode, ' -- ', c, b, a);
            // console.log(this.ram)
            const param1 = c == POSITION_MODE ? this.ram[this.ram[this.insPtr + 1]] : this.ram[this.insPtr + 1];
            const param2 = b == POSITION_MODE ? this.ram[this.ram[this.insPtr + 2]] : this.ram[this.insPtr + 2];
            const des = this.ram[this.insPtr + 3];
            // console.log(param1, param2, des)
            switch (opcode) {
                case 1:
                    this.ram[des] = param1 + param2;
                    break;
                case 2:
                    this.ram[des] = param1 * param2;
                    break;
                case 3:
                    this.ram[this.ram[this.insPtr + 1]] = this.init ? this.A : this.B;
                    this.init = false;
                    break;
                case 4:
                    this.output = this.ram[this.ram[this.insPtr + 1]];
                    this.insPtr += 2
                    console.log("---", this.insPtr, this.output);
                    return this.output
                case 5:
                    this.insPtr = param1 != 0 ? param2 : this.insPtr + 3;
                    break;
                case 6:
                    this.insPtr = param1 == 0 ? param2 : this.insPtr + 3;
                    break;
                case 7:
                    this.ram[des] = param1 < param2 ? 1 : 0;
                    break;
                case 8:
                    this.ram[des] = param1 == param2 ? 1 : 0;
                    break;
    
                default:
                    console.log("jasdkajshdkajshda")
                    break;
            }
            if (!(opcode == 5 || opcode == 6)) {
                this.insPtr += INSTRUCTION_SIZE[opcode];
            }
        }
        this.flag99 = true;
        return this.output
    
    }

}



// const solve = (numbers: number[], input_a: number, input_b: number, insPtr: number): [number, number] => {
//     var output = 0;
//     var first = (insPtr == 0);
//     // insPtr = 0;
//     console.log("ptr", insPtr)
//     while (numbers[insPtr] != 99) {
//         const opcode = parseInt(numbers[insPtr].toString().slice(-1));
//         const modes = Math.floor(numbers[insPtr] / 100);
//         const c = modes % 10;
//         const b = Math.floor(modes / 10) % 10;
//         const a = Math.floor(modes / 100);
//         // console.log(numbers[insPtr], ' # ', opcode, ' -- ', c, b, a);

//         const param1 = c == POSITION_MODE ? numbers[numbers[insPtr + 1]] : numbers[insPtr + 1];
//         const param2 = b == POSITION_MODE ? numbers[numbers[insPtr + 2]] : numbers[insPtr + 2];
//         const des = numbers[insPtr + 3];
//         switch (opcode) {
//             case 1:
//                 numbers[des] = param1 + param2;
//                 break;
//             case 2:
//                 numbers[des] = param1 * param2;
//                 break;
//             case 3:
//                 numbers[numbers[insPtr + 1]] = first ? input_a : input_b;
//                 first = false;
//                 break;
//             case 4:
//                 output = numbers[numbers[insPtr + 1]];
//                 return [output, insPtr+2];
//             case 5:
//                 insPtr = param1 != 0 ? param2 : insPtr + 3;
//                 break;
//             case 6:
//                 insPtr = param1 == 0 ? param2 : insPtr + 3;
//                 break;
//             case 7:
//                 numbers[des] = param1 < param2 ? 1 : 0;
//                 break;
//             case 8:
//                 numbers[des] = param1 == param2 ? 1 : 0;
//                 break;

//             default:
//                 break;
//         }
//         if (!(opcode == 5 || opcode == 6)) {
//             insPtr += INSTRUCTION_SIZE[opcode];
//         }
//     }
//     console.log("ASDJALSJDKLAJSKDJA")
//     return [output, -1];
// };

// 43210

var max = 0;

for (let index = 0; index < 99999; index++) {
    const p1 = index%10;
    const p2 = Math.floor(((index%100) / 10));
    const p3 = Math.floor(((index%1000) / 100));
    const p4 = Math.floor(((index%10000) / 1000));
    const p5 = Math.floor(index / 10000);
    const mySet = new Set([p1, p2, p3, p4, p5])
    if (mySet.size == 5 && ! (mySet.has(0) || mySet.has(1) || mySet.has(2) || mySet.has(3) || mySet.has(4))) {
        // console.log(mySet);

        // const p2 = solve([...ins], 5);
        const cpus: CPU[] = [];
        const phases: number[] = [p1, p2, p3, p4, p5];

        for (let index = 0; index < 5; index++) {
            cpus.push(new CPU(ins, phases[index], 0));
        }
        var last = 0;
        while (!cpus[4].flag99) {
            for (let index = 0; index < 5; index++) {
                cpus[index].B = last;
                last = cpus[index].run()
            }
        }
        
        max = last > max ? last : max;
    }
}

console.log(max)

// https://www.reddit.com/r/adventofcode/comments/e7aqcb/2019_day_7_part_2_confused_with_the_question/#:~:text=The%20whole%20feedback%20loop%20stops,signal%20as%20the%20thrust%20value.


// const cpus: CPU[] = [];
// const phases: number[] = [9,8,7,6,5];

// for (let index = 0; index < 5; index++) {
//     cpus.push(new CPU(ins, phases[index], 0));
// }

// // var last = cpus[0].run()
// // console.log(last);

// var last = 0;
// while (!cpus[4].flag99) {
//     for (let index = 0; index < 5; index++) {
//         cpus[index].B = last;
//         last = cpus[index].run()
//     }
//     console.log(last);
// }
// console.log(last);

// var o = 0;
// let ampA = new CPU(ins, 9, o);
// o = ampA.run();
// console.log(o)
// let ampB = new CPU(ins, 8, o);
// o = ampB.run();
// console.log(o)
// let ampC = new CPU(ins, 7, o);
// o = ampC.run();
// let ampD = new CPU(ins, 5, o);
// o = ampD.run();
// let ampE = new CPU(ins, 6, o);
// o = ampE.run();
// console.log(o)
// while (i) {
//     ampA.B = o
//     o = ampA.run();
//     ampB.B = o
//     o = ampB.run();
//     ampC.B = o
//     o = ampC.run();
//     ampD.B = o
//     o = ampD.run();
//     ampE.B = o
//     o = ampE.run();

//     console.log(o);
//     i--;
// }

