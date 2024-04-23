import { readFileSync } from 'fs';
import { assert } from 'console';

const file = readFileSync('solutions/day12.dat', 'utf-8');
const lines = file.split('\n')


interface Point {
    x: number;
    y: number;
    z: number;
}

const current: Point = {
    x: 0,
    y: 0,
    z: 0
};

const vPoint = (a: number, b: number) => {
    if (a == b) {return 0;}
    else if (a > b) {return -1;}
    else {return 1;}
}

const calcGravity = (p1: Point, p2: Point): Point => {
    
    const x = vPoint(p1.x, p2.x)
    const y = vPoint(p1.y, p2.y)
    const z = vPoint(p1.z, p2.z)
    return {x, y, z}
}
const sumPoints = (p1: Point, p2: Point): Point => {
    return {x : p1.x+p2.x, y : p1.y+p2.y, z : p1.z+p2.z}
}
const toAbs = (p: Point) => {
    return Math.abs(p.x) + Math.abs(p.y) + Math.abs(p.z);
}

const planets: Point[] = [];
const velocities: Point[] = [];
for (let l of lines) {
    const numbersArray: RegExpMatchArray | null = l.match(/-?\d+/g);
    console.log(numbersArray)
    const [x, y, z] = numbersArray.map(x => parseInt(x));
    planets.push({x:x, y:y, z:z});
    velocities.push({x:0, y:0, z:0});
}
console.log(planets);

// part 1
for (let time = 0; time < 1000 /*un comment here*/; time++) {
    console.log(planets[0].x)
    for (let i = 0; i < planets.length; i++) {
        for (let j = 0; j < planets.length; j++) {
            if (i == j) {continue;}
            const grav = calcGravity(planets[i], planets[j])
            // console.log(i, j, grav)
            velocities[i] = sumPoints(velocities[i], grav)
        }
    }
    var totEng = 0
    for (let i = 0; i < planets.length; i++) {
        planets[i] = sumPoints(planets[i], velocities[i])
        // console.log(planets[i], velocities[i])
        totEng += toAbs(planets[i]) * toAbs(velocities[i]);
    }
    console.log(time, totEng)
}

