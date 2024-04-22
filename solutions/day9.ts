import { readFileSync } from 'fs';
import { assert } from 'console';

const file = readFileSync('solutions/day9.dat', 'utf-8');
const ins = file.split(',').map(x => parseInt(x));

const POSITION_MODE = 0;
const IMMEDIATE_MODE = 1;
const RELATIVE_MODE = 2;
const INSTRUCTION_SIZE = [0, 4, 4, 2, 2, 0, 0, 4, 4, 2];

class CPU {
    // private rom: number[];
    public ram: number[]
    private insPtr: number;
    public A: number;
    public B: number;
    public output: number;
    public flag99: boolean;
    public init: boolean;
    public rbase: number;

    constructor(rom: number[], a: number, b: number) {
        this.ram = new Array(50000).fill(0)
        for (let index = 0; index < rom.length; index++) {
            this.ram[index] = rom[index];
        }
        
        this.insPtr = 0;
        this.A = a;
        this.B = b;
        this.output = 0;
        this.flag99 = false;
        this.init = true;
        this.rbase = 0;
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


    run(): number {
        
        const outputs: number[] = []
        while (this.ram[this.insPtr] != 99) {
            const opcode = parseInt(this.ram[this.insPtr].toString().slice(-1));
            // modes
            const modes = Math.floor(this.ram[this.insPtr] / 100);
            const mode_p1 = modes % 10;
            const mode_p2 = Math.floor(modes / 10) % 10;
            const mode_p3 = Math.floor(modes / 100);

            console.log(this.ram.slice(this.insPtr, this.insPtr+INSTRUCTION_SIZE[opcode]), ' \t# opcode: ', opcode, ' -- parameter modes: ', mode_p1, mode_p2, mode_p3);
            
            const param1 = this.memRead(mode_p1, this.insPtr + 1)
            const param2 = this.memRead(mode_p2, this.insPtr + 2)
            const des = this.getAddress(mode_p3, this.insPtr + 3)

            console.log("\t parameters",param1, param2, des)
            switch (opcode) {
                case 1:
                    this.ram[des] = param1 + param2;
                    break;
                case 2:
                    this.ram[des] = param1 * param2;
                    break;
                case 3:
                    const address = this.getAddress(mode_p1, this.insPtr + 1)
                    this.ram[address] = this.init ? this.A : this.B;
                    this.init = false;
                    break;
                case 4:
                    this.output = param1;
                    outputs.push(this.output)
                    break;
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
                case 9:
                    this.rbase += param1
                    console.log("rbase is now", this.rbase)
                    break;
                default:
                    console.log("jasdkajshdkajshda")
                    break;
            }
            // 5 and 6 use conditional jumps
            if (!(opcode == 5 || opcode == 6)) {
                this.insPtr += INSTRUCTION_SIZE[opcode];
            }
            console.log("\n")
        }
        this.flag99 = true;
        
        return this.output
    
    }

}

{
    const file = readFileSync('solutions/day9_test.dat', 'utf-8');
    const tests = file.split('\n')//.map(x => parseInt(x));
    console.log(tests)
    for (const test of tests) {
        const [values, testval] = test.split("outputs");
        const tval = parseInt(testval);
        const rom = values.substring(1, values.length-2).split(",").map(x => parseInt(x))
        const cpu = new CPU(rom, 1, 1);
        console.log("running: ", rom, "expecting", tval)
        assert(cpu.run() == tval)
    }
    
}
// {
//     const cpu = new CPU(ins, 1, 1);
//     console.log("output", cpu.run())
// }

// {
//     const cpu = new CPU(ins, 2, 2);
//     console.log("output", cpu.run())
// }

