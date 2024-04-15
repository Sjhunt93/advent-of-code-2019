import { readFileSync } from 'fs';
import { assert } from 'console';

const file = readFileSync('solutions/day8.dat', 'utf-8');
const ins = [...file].map(x => parseInt(x));



const width = 25;
const height = 6;
const black = 0;
const white = 1;
const trans = 2;

class Layer {
    public matrix: number[][];

    constructor() {
        this.matrix = [];
        for (let index = 0; index < height; index++) {
            this.matrix.push(Array(width).fill(0));
        }       
    }

    fill(buffer: number[], start: number) {

        for (let index = 0; index < width*height; index++) {
            const x = index % width;
            const y = Math.floor(index / width);
            this.matrix[y][x] = buffer[start+index];
        }
    }
    print() {
        for (let element of this.matrix) {
            for (let x of element) {
                let a = (x.toString() === "0") ? " " : "x"
                process.stdout.write(a);
            }
            console.log("");
        }
    }
    count(x: number) {
        var i = 0;
        for (let row of this.matrix) {
            i += row.reduce((accumulator, currentValue) => accumulator + (currentValue === x ? 1 : 0), 0);
        }
        return i;
    }
    get(index: number) {
        const x = index % width;
        const y = Math.floor(index / width);
        return this.matrix[y][x]
    }
    put(index: number, val: number) {
        const x = index % width;
        const y = Math.floor(index / width);
        this.matrix[y][x] = val
    }
}

const layers: Layer[] = [];
var i = 0;
while (i < ins.length) {
    const layer = new Layer()
    layer.fill(ins, i);
    layers.push(layer);
    i += width * height;
}
console.log(layers.length)

// part 1
const zeros = layers.map(layer => layer.count(0));
const minIndex = zeros.indexOf(Math.min(...zeros));
console.log(minIndex);

console.log(layers[minIndex].count(1) * layers[minIndex].count(2))

// part 2

const final_layer = new Layer();


for (let index = 0; index < width*height; index++) {
    var l = 0;
    while (l < layers.length) {
        if (layers[l].get(index) == 2) {
            l++;    
        }
        else {
            final_layer.put(index, layers[l].get(index))
            break;
        }
        
    }
}

final_layer.print()