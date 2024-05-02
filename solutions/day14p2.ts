import { copyFileSync, readFileSync } from 'fs';
import { assert, time, timeEnd, timeLog } from 'console';

interface Resource {
    val: number;
    type: string;
}

const graph = new Map<string, Array<Resource> >();
const quantities = new Map<string, number>();

const file = readFileSync('solutions/day14.dat', 'utf-8');
const lines = file.split("\n")
const mappings = lines.map(x => x.split("=>"));


for (const m of mappings) {
    const left = m[0].split(",").map(x => x.split(" ").filter( x => !!x))
    const right = m[1].split(",").map(x => x.split(" ").filter( x => !!x))
    // console.log(m, left)
    console.log(left, " --> ",  right)
    const [q, res] = right[0];
    console.log(q, res)

    const items: Array<Resource> = [];  
    for (let index = 0; index < left.length; index++) {
        const element = left[index];
        console.log("###", element)
        const current: Resource = {
            val: parseInt(element[0]),
            type: element[1] 
        };
        items.push(current)
    }
    graph.set(res, items);
    quantities.set(res, parseInt(q));
}

const inventory = new Map<string, number>();

const resetInventory = () => {
    for (const key of Array.from( quantities.keys() )) {
        inventory[key] = 0;
    }
}
resetInventory()

const search = (target: string, target_amount: number ) => {

    if (target == 'ORE') {
       return target_amount
    }
    // if we already have this material then return
    else if (target_amount <= inventory[target]) {
        inventory[target] -= target_amount;
        return 0;
    }

    // first empty whats in the inv
    target_amount -= inventory[target]
    inventory[target] = 0;
    var ore = 0;

    const inputs = graph.get(target)
    const output_amount = quantities.get(target)

    const copies = Math.ceil(target_amount / output_amount)


    for (let index = 0; index < inputs.length; index++) {
        const input_amount = inputs[index].val * copies;
        ore += search(inputs[index].type, input_amount)
    }
    inventory[target] += (output_amount * copies) - target_amount
    return ore;

}


const oreFor1 = search("FUEL", 1)

const target = 1000000000000;
const approx = target/oreFor1;

// shorten the binary search
var min = approx;
var max = approx * 2;
var a = Math.floor(max-min / 2);

var fuelTarget = 0;
while (min <= max) {
    fuelTarget = Math.floor((min + max) / 2);

    resetInventory()
    console.log("a is: ", a, min, max)
    const ore = search("FUEL", fuelTarget)
    if (ore < target) {
        min = fuelTarget + 1
    }
    else {
        max = fuelTarget - 1
    }
    console.log("\t", ore, min, max)
}


// while (search("FUEL", fuelTarget) < target) {
//     fuelTarget += 1;
// }

console.log(fuelTarget)