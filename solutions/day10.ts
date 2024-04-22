import { readFileSync } from 'fs';
import { assert } from 'console';

/*
    This is a very hard puzzle in part 2.
    Needed to translate the circle basically phase offset

        B
    C   *   A
        D

    The circle rotates anti-clockwise we need clockwise so we can * -1 to create clockwise angles

        B
    A   *   C
        D

    We want the list of angles to start from B so we can subtract PI/2

        A
    D   *   B
        C
    
    This means we cycle from - 3Pi/2 or + PI/2

    Finally to put these in a sorted order we can do
    if a <= 0:
        a += 2PI

    Finally we sort out list and then reverse it (I think we reverse this because of the *-1 offset we do after calling atan2)
    There is a bug where by the first element to get removed is at the end as the angle == 0
*/


const file = readFileSync('solutions/day10.dat', 'utf-8');
const lines = file.split("\n");

interface Point {
    x: number;
    y: number;
}

let astroids: Point[] = [];

function atan2ForPoints(x1: number, y1: number, x2: number, y2: number): number {
    return Math.atan2(y2 - y1, x2 - x1);
}

const radiansToDegrees = (radians: number): number => {
    return radians * (180 / Math.PI);
};
const degreesToRadians = (degrees: number): number => {
    return degrees * (Math.PI / 180);
};

const getPositionOnCircle = (angleRadians: number, radius: number): Point => {
    const x = radius * Math.cos(angleRadians);
    const y = radius * Math.sin(angleRadians);
    return { x, y };
};


for (let row = 0; row < lines.length; row++) {
    const line = lines[row];
    for (let i = 0; i < line.length; i++) {
        const p = line[i];
        console.log(p);
        if (p == '#') {
            astroids.push({x:i, y:row});
        }
    }
}
console.log(astroids)
var max=0;
var ri = 0;
for (let index = 0; index < astroids.length; index++) {
    let results: Set<number> = new Set();
    for (let j = 0; j < astroids.length; j++) {
        if (index == j) {continue;}
        const angle = atan2ForPoints(astroids[index].x, astroids[index].y, astroids[j].x, astroids[j].y)
        results.add(angle);   
    }
    if (results.size > max) {
        max = results.size;
        ri = index;
    }
    max = results.size > max ? results.size : max;
    console.log(results.size, astroids[index])
}
console.log(astroids[ri], max)


// part 2
const points = new Map<number, Point>();

let angles_set: Set<number> = new Set();
for (let j = 0; j < astroids.length; j++) {
    let angle = atan2ForPoints(astroids[ri].x, astroids[ri].y, astroids[j].x, astroids[j].y) * -1;
    angle -= Math.PI / 2; // snap to 12 o clock
    if (angle <= 0) { // offset phase 
        angle += (Math.PI * 2);
    }
    angles_set.add(angle);   
    points.set(angle, astroids[j])
}

let angles = Array.from(angles_set);
angles.sort()
angles = angles.reverse()


var i = 0;
for (let item of angles) {
    console.log(i, item, radiansToDegrees(item), points.get(item));
    i++;
}



console.log(angles[199], points.get(angles[199]))
console.log(astroids[ri])
console.log("-------")


// console.log(atan2ForPoints(0,0, 0, -15), radiansToDegrees(atan2ForPoints(0,0, 0, -15)))

// console.log(atan2ForPoints(0,0, 15, 0), radiansToDegrees(atan2ForPoints(0,0, 15, 0)))
// console.log(atan2ForPoints(0,-1, 15, 0), radiansToDegrees(atan2ForPoints(0,-1, 15, 0)))

// console.log(atan2ForPoints(0,0, -15, 0), radiansToDegrees(atan2ForPoints(0,0, -15, 0)))

// console.log(atan2ForPoints(0,0, 0, 5), radiansToDegrees(atan2ForPoints(0,0, 0, 5)))
// console.log(atan2ForPoints(0,0, 0, -5), radiansToDegrees(atan2ForPoints(0,0, 0, -5)))
    // console.log(atan2ForPoints(0,0, -15, 0), radiansToDegrees(atan2ForPoints(0,0, -15, 0)))
// console.log(atan2ForPoints(0,0, 15, 15), radiansToDegrees(atan2ForPoints(0,0, 15, 15)))
// console.log(atan2ForPoints(0,0, 15, 15), radiansToDegrees(atan2ForPoints(0,0, 15, 15)))
