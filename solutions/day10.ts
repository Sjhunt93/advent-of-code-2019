import { readFileSync } from 'fs';
import { assert } from 'console';

const file = readFileSync('solutions/day10.dat', 'utf-8');
const lines = file.split("\n");
console.log(lines);

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

// for (let index = 0; index <= 360; index++) {
//     console.log(index, degreesToRadians(index), getPositionOnCircle(degreesToRadians(index), 10))
// }



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

const points = new Map<number, Point>();

let angles_set: Set<number> = new Set();
for (let j = 0; j < astroids.length; j++) {
    let angle = atan2ForPoints(astroids[ri].x, astroids[ri].y, astroids[j].x, astroids[j].y) * -1; //; - Math.PI / 2;// + Math.PI * 2//*Math.PI/1.
    angle -= Math.PI / 2;
    if (angle < 0) {
        angle += (Math.PI * 2);// * 3;
    }
    // const deg = radiansToDegrees(angle-Math.PI/2)+270;
    // const deg = radiansToDegrees(angle+Math.PI/2)-270;
    // const deg = angle;
    // angle = angle % Math.PI
    // if (angle < 0) {
    //     angle += Math.PI
    // }

    angles_set.add(angle);   
    // // results.add(angle)
    points.set(angle, astroids[j])
}

let angles = Array.from(angles_set);
angles.sort()//((a, b) => a - b);
angles = angles.reverse()
// // { x: 8, y: 2
var i = 0;
for (let item of angles) {
    console.log(i, item, radiansToDegrees(item), points.get(item));
    i++;
}



console.log(angles[199], points.get(angles[199]))
console.log(astroids[ri])
console.log("-------")

let angle = atan2ForPoints(astroids[ri].x, astroids[ri].y, 20, 13);// + Math.PI * 2//*Math.PI/1.
console.log(angle)


// const x = atan2ForPoints(0,0, 0, 15)-Math.PI/2
// console.log(x, radiansToDegrees(x))
// console.log(atan2ForPoints(0,0, 0, -15), radiansToDegrees(atan2ForPoints(0,0, 0, -15)))

// console.log(atan2ForPoints(0,0, 15, 0), radiansToDegrees(atan2ForPoints(0,0, 15, 0)))
// console.log(atan2ForPoints(0,-1, 15, 0), radiansToDegrees(atan2ForPoints(0,-1, 15, 0)))

// console.log(atan2ForPoints(0,0, -15, 0), radiansToDegrees(atan2ForPoints(0,0, -15, 0)))

// console.log(atan2ForPoints(0,0, 0, 5), radiansToDegrees(atan2ForPoints(0,0, 0, 5)))
// console.log(atan2ForPoints(0,0, 0, -5), radiansToDegrees(atan2ForPoints(0,0, 0, -5)))
    // console.log(atan2ForPoints(0,0, -15, 0), radiansToDegrees(atan2ForPoints(0,0, -15, 0)))
// console.log(atan2ForPoints(0,0, 15, 15), radiansToDegrees(atan2ForPoints(0,0, 15, 15)))
// console.log(atan2ForPoints(0,0, 15, 15), radiansToDegrees(atan2ForPoints(0,0, 15, 15)))
