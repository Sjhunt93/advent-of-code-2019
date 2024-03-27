import { readFileSync } from 'fs';
import { assert } from 'console';

const file = readFileSync('solutions/day6.dat', 'utf-8');

let adjacencyList: Map<string, string[]> = new Map();
const allNodes: Set<string> = new Set();
for (let line of file.split('\n')) {
    const objects = line.split(')');
    console.log(objects);
    if (!adjacencyList.has(objects[0])) {
        adjacencyList.set(objects[0], [objects[1]]);
    } else {
        adjacencyList.get(objects[0])?.push(objects[1]);
    }
    allNodes.add(objects[0]);
    allNodes.add(objects[1]);
}


const dfs_sol1 = (node: string, depth: number) => {
    const children = adjacencyList.get(node);
    var d = depth
    if (children) {
        for (const n of children) {
            d += dfs_sol1(n, depth+1)
        }
    }
    return d

}

const dfs_sol2 = (node: string, to_find: string) => {
    const children = adjacencyList.get(node);
    const path: string[] = [];
    if (node == to_find) {
        console.log("Found")
        path.push(to_find)
        return path;
    }
    if (children) {
        for (const n of children) {
            const a: string[] = dfs_sol2(n, to_find);
            if (a.length) {
                a.push(n)
                return a;
            }
        }
    }
    return path;

}
// const bfs = 

console.log(dfs_sol1("COM", 0))

const p1 = dfs_sol2("COM", "YOU").slice().reverse();
const p2 = dfs_sol2("COM", "SAN").slice().reverse();

console.log(p1)
console.log(p2)

var i = 0;
while (p1[i] == p2[i]) {
    i++;
}
// the minus 1 here is because the list has one excessive element..
const common_to_you = p1.length-1-i;
const common_to_san = p2.length-1-i;
// we can ignore the last elements also
console.log(common_to_you+common_to_san-2);