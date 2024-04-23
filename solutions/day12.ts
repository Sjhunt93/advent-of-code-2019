import { readFileSync } from 'fs';
import { assert } from 'console';

const file = readFileSync('solutions/day12.dat', 'utf-8');
const lines = file.split('\n')


interface Point {
    x: number;
    y: number;
    z: number;
}


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
for (let time = 0; time < 0 /*un comment here*/; time++) {
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
// part 2



const res: number[] = []
for (let axis of ["x", "y", "z"]) {
    var count = 0;
    const seen = new Set()
    while (true) {
        var key = "";
        for (let i = 0; i < planets.length; i++) {
            
            key += planets[i][axis].toString() + ":" + velocities[i][axis].toString() + "~";
        }
        if (seen.has(key)) {
            console.log(axis, count)
            res.push(count)
            break;
        }
        else {
            seen.add(key)
        }

        for (let i = 0; i < planets.length; i++) {
            for (let j = 0; j < planets.length; j++) {
                if (i == j) {continue;}
                const grav = calcGravity(planets[i], planets[j])
                // console.log(i, j, grav)
                velocities[i] = sumPoints(velocities[i], grav)
            }
        }
        for (let i = 0; i < planets.length; i++) {
            planets[i] = sumPoints(planets[i], velocities[i])
        }

        count += 1
        console.log(count, axis, key)
    }
}

// taken from GPT :D 
function gcd(a: bigint, b: bigint): bigint {
    // Euclidean algorithm to find the greatest common divisor
    while (b !== BigInt(0)) {
        const temp = b;
        b = a % b;
        a = temp;
    }
    return a;
}

function lcm(a: bigint, b: bigint): bigint {

    return (a * b) / gcd(a, b);
}
console.log(res)
console.log(lcm(BigInt(res[0]), lcm(BigInt(res[1]), BigInt(res[2]))))