import { readFileSync } from 'fs';
import { assert } from 'console';

const file = readFileSync('solutions/day9.dat', 'utf-8');
const ins = file.split(',').map(x => parseInt(x));

const POSITION_MODE = 0;
const IMMEDIATE_MODE = 1;
const INSTRUCTION_SIZE = [0, 4, 4, 2, 2, 0, 0, 4, 4, 2];

class CPU {
    // private rom: number[];
    // private ram: number[]
    private ram: Map<number, number>;

    private insPtr: number;
    public A: number;
    public B: number;
    public output: number;
    public flag99: boolean;
    public init: boolean;
    public rBase: number;

    constructor(rom: number[], a: number, b: number) {
        this.ram = new Map<number, number>();//[...rom];
        
        for (let index = 0; index < rom.length; index++) {
            this.ram.set(index, rom[index]);    
        }
        
        this.insPtr = 0;
        this.A = a;
        this.B = b;
        this.output = 0;
        this.flag99 = false;
        this.init = true;
        this.rBase = 0;
    }

    read(address: number): number {
        return this.ram.get(address) ?? 0;
    }
    write(address: number, val: number) {
        this.ram.set(address, val)
    }

    run(): number {
        
        while (this.ram.get(this.insPtr) != 99) {
            
            const opcode = parseInt(this.read(this.insPtr).toString().slice(-1));
            const modes = Math.floor(this.read(this.insPtr) / 100);
            const c = modes % 10;
            const b = Math.floor(modes / 10) % 10;
            const a = Math.floor(modes / 100);
            console.log(this.read(this.insPtr), ' # ', opcode, ' -- ', c, b, a);
            // console.log(this.ram)
            let param1 = 0;
            if (c == POSITION_MODE) {
                param1 = this.read(this.read(this.insPtr + 1))
            }
            else if (c == IMMEDIATE_MODE) {
                param1 = this.read(this.insPtr + 1);
            }
            else {
                param1 = this.read(this.insPtr + 1 + this.rBase);
            }

            let param2 = 0;
            if (b == POSITION_MODE) {
                param2 = this.read(this.read(this.insPtr + 2))
            }
            else if (b == IMMEDIATE_MODE) {
                param2 = this.read(this.insPtr + 2);
            }
            else {
                param2 = this.read(this.insPtr + 2 + this.rBase);
            }
            // const param1 = c == POSITION_MODE ? this.ram[this.ram[this.insPtr + 1]] : this.ram[this.insPtr + 1];
            // const param2 = b == POSITION_MODE ? this.ram[this.ram[this.insPtr + 2]] : this.ram[this.insPtr + 2];
            const des = this.read(a == 2 ? this.insPtr + 3 + this.rBase : this.insPtr + 3);
            console.log("-->", param1, param2, des)
            switch (opcode) {
                case 1:
                    this.ram.set(des, param1 + param2)
                    
                    break;
                case 2:
                    this.ram.set(des, param1 * param2); 
                    
                    break;
                case 3:
                    this.write(this.read(this.insPtr + 1), this.init ? this.A : this.B)
                    this.init = false;
                    break;
                case 4:
                    // this.output = this.read(this.read(this.insPtr + 1));
                    this.output = this.read(param1);
                    // this.insPtr += 2
                    console.log("---", this.insPtr, this.output);
                    // break;
                    return this.output
                case 5:
                    this.insPtr = param1 != 0 ? param2 : this.insPtr + 3;
                    break;
                case 6:
                    this.insPtr = param1 == 0 ? param2 : this.insPtr + 3;
                    break;
                case 7:
                    this.write(des, param1 < param2 ? 1 : 0)
                    
                    break;
                case 8:
                    this.write(des, param1 == param2 ? 1 : 0)
                    break;
                case 9:
                    this.rBase += param1
                    break;
                default:
                    console.log("jasdkajshdkajshda", opcode)
                    break;
            }
            if (!(opcode == 5 || opcode == 6)) {
                // console.log("++", INSTRUCTION_SIZE[opcode]);
                this.insPtr += INSTRUCTION_SIZE[opcode];
            }
            console.log("\n");
        }
        this.flag99 = true;
        return this.output
    
    }

}

const cpu = new CPU(ins, 1, 1);
console.log("output:", cpu.run())

