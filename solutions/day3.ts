import { readFileSync } from 'fs';
import { assert } from "console";


const file = readFileSync('solutions/day3.dat', 'utf-8');
const ropes = file.split("\n");
const r1 = ropes[0].split(",");//.map(x => parseInt(x));
const r2 = ropes[1].split(",");//.map(x => parseInt(x));


function manhattanDistance(x1: number, y1: number, x2: number, y2: number): number {
    return Math.abs(x1 - x2) + Math.abs(y1 - y2);
}

const getPoints = (inputs: string[]) => {
    const rpoints: number[][] = [];

    var x = 0;
    var y = 0;

    for (let co of inputs) {
        const letter = co[0];
        const n = parseInt(co.slice(1, 10));
        console.log(letter, n);
        
        for (var i = 0; i < n; i++) {
            if (letter === 'R') {
                x++;
            }
            else if (letter === 'L') {
                x--;
            }
            else if (letter === 'U') {
                y++;
            }
            else if (letter === 'D') {
                y--;
            }
            rpoints.push([x, y]);
        }   
    }
    return rpoints;
}
const buildMap = (points: number[][]) => {
    let hashMap: { [key: string]: any } = {};

    for (var i = 0; i < points.length; i++) {
        let key: string = points[i][0] + ":" + points[i][1];
        // console.log(key);
        if (! (key in hashMap)) {
            hashMap[key] = i+1;
        }
    }
    return hashMap;
}

const r1points: number[][] = getPoints(r1);
const r2points: number[][] = getPoints(r2);

let hashMapR1 = buildMap(r1points);
let hashMapR2 = buildMap(r2points);

// Need a find to improve this
const distances: number[] = [];
var minSteps = 100000000;
for (let a of r1points) {
    for (let b of r2points) {
        if (a[0] == b[0] && a[1] == b[1]) {
            const d = manhattanDistance(0, 0, a[0], a[1]);
            
            distances.push(d);
            let key: string = a[0] + ":" + a[1];
            const m = hashMapR1[key] + hashMapR2[key];
            minSteps = m < minSteps ? m : minSteps;
            console.log(a, b, d, m)

        }
    }
}

console.log(minSteps);