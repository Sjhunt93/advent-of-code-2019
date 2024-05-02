import { readFileSync } from 'fs';
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
    // graph.set(res, left.map(x => {val: x[0], type: x[1]}))
    graph.set(res, items);
    quantities.set(res, parseInt(q));
}

const inventory = new Map<string, number>();

for (const key of Array.from( quantities.keys() )) {
    inventory[key] = 0;
}

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
        // const ins = inputs[index];
        // console.log(ins)
        // if (ins.type == "ORE") {
        //     console.log("ORE")
        //     return ins.val
        // }
        // else {
        //     total += search(ins.type) * ins.val
        //     console.log(ins, graph.get(ins.type))
        // }
    }
    inventory[target] += (output_amount * copies) - target_amount
    return ore;

}

// values = things: Map<string, number>


console.log(graph)
console.log(quantities)

console.log(search("FUEL", 1))




// const requires = (key: string, q: number) => {
//     const inputs =graph.get(key);
//     console.log(q, key, "requires", inputs)
//     if (key === "ORE") {
//         inventory["ORE"] += q
//         // return
//     }
//     for (let index = 0; index < inputs.length; index++) {
//         console.log("looking for", inputs[index].val, inputs[index].type)
//         while (inventory[inputs[index].type] < q) {
//             requires(inputs[index].type, inputs[index].val)
            
//         }
//     }
 
// }

// requires("FUEL", 1)


