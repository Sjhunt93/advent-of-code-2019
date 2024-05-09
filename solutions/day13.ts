import { readFileSync } from 'fs';
import { assert, time, timeEnd, timeLog } from 'console';

const file = readFileSync('solutions/day13.dat', 'utf-8');
const ins = file.split(',').map(x => parseInt(x));

const POSITION_MODE = 0;
const IMMEDIATE_MODE = 1;
const RELATIVE_MODE = 2;
const INSTRUCTION_SIZE = [0, 4, 4, 2, 2, 0, 0, 4, 4, 2];

class CPU {
    // private rom: number[];
    public ram: number[]
    public insPtr: number;
    public A: number;
    public B: number;
    public output: number;
    public flag99: boolean;
    public init: boolean;
    public rbase: number;
    private read_func: () => number;

    constructor(rom: number[], read_func: () => number) {
        this.ram = new Array(50000).fill(0)
        for (let index = 0; index < rom.length; index++) {
            this.ram[index] = rom[index];
        }
        
        this.insPtr = 0;
        this.output = 0;
        this.flag99 = false;
        this.init = true;
        this.rbase = 0;
        this.read_func = read_func
    }


    memRead(mode: number, param: number) : number {
        switch (mode) {
            case POSITION_MODE:
                return this.ram[this.ram[param]]
            case IMMEDIATE_MODE:
                return this.ram[param]
            case RELATIVE_MODE:
                return this.ram[this.ram[param] + this.rbase];
            default:
                break;
        }
        return 0;
    }
    // note that des has only 2 modes
    getAddress(mode: number, param: number) {
        if (mode == POSITION_MODE) {
            return this.ram[param]
        }
        else {
            return this.ram[param] + this.rbase
        }
    }


    run(): number[] {
        
        const outputs: number[] = []
        while (this.ram[this.insPtr] != 99) {
            const opcode = parseInt(this.ram[this.insPtr].toString().slice(-1));
            // modes
            const modes = Math.floor(this.ram[this.insPtr] / 100);
            const mode_p1 = modes % 10;
            const mode_p2 = Math.floor(modes / 10) % 10;
            const mode_p3 = Math.floor(modes / 100);

            // console.log('# opcode: ', opcode, ' -- parameter modes: ', mode_p1, mode_p2, mode_p3, this.ram.slice(this.insPtr, this.insPtr+INSTRUCTION_SIZE[opcode]));
            
            const param1 = this.memRead(mode_p1, this.insPtr + 1)
            const param2 = this.memRead(mode_p2, this.insPtr + 2)
            const des = this.getAddress(mode_p3, this.insPtr + 3)
            
            // console.log("\t parameters",param1, param2, des)
            switch (opcode) {
                case 1:
                    this.ram[des] = param1 + param2;
                    break;
                case 2:
                    this.ram[des] = param1 * param2;
                    break;
                case 3:
                    const address = this.getAddress(mode_p1, this.insPtr + 1)
                    this.ram[address] = this.read_func()
                    this.init = false;
                    break;
                case 4:
                    this.output = param1;
                    outputs.push(this.output)
                    break;
                    
                case 5: //jump if true
                    this.insPtr = param1 != 0 ? param2 : this.insPtr + 3;
                    break;
                case 6: //jump if false
                    this.insPtr = param1 == 0 ? param2 : this.insPtr + 3;
                    break;
                case 7: // less than
                    this.ram[des] = param1 < param2 ? 1 : 0;
                    break;
                case 8: // equal
                    this.ram[des] = param1 == param2 ? 1 : 0;
                    break;
                case 9:
                    this.rbase += param1
                    break;
                default:
                    break;
            }
            // 5 and 6 use conditional jumps
            if (!(opcode == 5 || opcode == 6)) {
                this.insPtr += INSTRUCTION_SIZE[opcode];
            }
            if (outputs.length == 3) {
                if (this.insPtr == 443) {
                    // console.log("..")
                }
                return outputs;
            }
            // console.log("\n")
        }
        this.flag99 = true;
        
        return outputs;
    
    }

}

interface Point {
    x: number;
    y: number;
}

const current: Point = {
    x: 0,
    y: 0
};
let angle = 0
const points = new Map<string, number >();
points.set("0:0", 1)





var xMin = 0;
var xMax = 0;
var yMin = 0;
var yMax = 0;

// part 1
// var count = 0;
// const cpu = new CPU(ins, checker);
// while (!cpu.flag99) {
//     const [x, y, tile] = cpu.run()
//     console.log("outputs", x, y, tile)
//     if (tile == 2) {
//         count ++;
//     }
// }
// console.log(count)

// part 2
var count = 0;
ins[0] = 2;


const memAddressPaddleX = 382;
const memAddressPaddleY = 383;
const memAddressPaddle = 384;

var ballXV = 0;
var ballYV = 0;
var ballXPos = 0;
var ballYPos = 0;

var score = 0;

var paddleX = 0;
var ballX = 0;

const checker = () : number => {
    // const key = current.x.toString() + ":" + current.y.toString()
    // return points.get(key) ?? 0;
    if (ballX > paddleX) {
        return 1;
    }
    else if (ballX < paddleX) {
        return -1;
    }
    else {
        return 0;
    }
    
}

const cpu = new CPU(ins, checker);




while (!cpu.flag99) {
    const [x, y, tile] = cpu.run()
    // console.log("outputs", x, y, tile)
    if (x == -1 && y == 0) {
        // score += tile;
        score = tile
    }
    else if (tile == 3) {
        console.log("paddle: ", x, y)
        // console.log("mem: ", cpu.ram[memAddressPaddleX], cpu.ram[392])
        paddleX = x;
    }
    else if (tile == 4) {
        // count ++;
        console.log("ball: ", x, y)
                // hackerman ----
        ballXV = (x > ballXPos) ? 1 : -1;
        ballYV = (y > ballYPos) ? 1 : -1;
        ballXPos = x;
        ballYPos = y;
        ballX = x;
        // console.log("target", (18-y), "will cross x at: ", x-(ballXV * (18-y)))
        // if (y == 17) {
        //     cpu.ram[392] = x + ballXV;
        //     console.log("mem: ", cpu.ram[memAddressPaddleX], cpu.ram[memAddressPaddleY])
        // }


        if (y == 18) {
            console.log("....")
        }
    }

}
console.log(score)