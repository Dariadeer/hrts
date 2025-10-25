class Vector {

    private static MAX = 10e6; // for integer vectors

    public static zero = new Vector(0, 0);
    public static up = new Vector(0, 1);
    public static right = new Vector(1, 0);
    public static down = new Vector(0, -1);
    public static left = new Vector(-1, 0);

    public static sin30 = Math.sin(Math.PI / 6);
    public static sin60 = Math.sin(Math.PI / 3);
    public static tan60 = Math.tan(Math.PI / 3);

    public x: number;
    public y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    public sub(v: Vector) {
        return new Vector(this.x - v.x, this.y - v.y);
    }

    public add(v: Vector) {
        return new Vector(this.x + v.x, this.y + v.y);
    }

    public scale(n: number) {
        return new Vector(this.x * n, this.y * n);
    }

    public div(n: number) {
        return new Vector(this.x / n, this.y / n);
    }

    public normalise() {
        if(this.x === 0 && this.y === 0) return Vector.zero;
        return this.div(this.length());
    }

    public round() {
        return new Vector(Math.round(this.x), Math.round(this.y));
    }

    public floor() {
        return new Vector(Math.floor(this.x), Math.floor(this.y));
    }

    public length() {
        return (this.x**2 + this.y**2)**0.5;
    }

    public distance(v: Vector) {
        return this.sub(v).length();
    }

    public abs() {
        return new Vector(Math.abs(this.x), Math.abs(this.y));
    }

    public angle() {
        return Math.atan2(this.y, this.x);
    }

    public components(): [number, number] {
        return [this.x, this.y];
    }

    public toHexCenter(r: number): Vector {
        return new Vector((1 + Vector.sin30) * r * this.x, Vector.sin60 * (2 * this.y - this.x) * r);
    }

    public rotateHex(n: number) {
        let r = new Vector(this.x, this.y);
        for(let i = 0; i < n; i++) {
            r = new Vector(r.x - r.y, r.x);
        }
        return r;
    }

    public toHex(hexSize: number): Vector {
        const x = this.x / 1.5 / hexSize;
        const guess = new Vector(x, (this.y / Vector.sin60 / hexSize - Math.round(x)) / 2);
        const fraction = guess.sub(guess.floor());
        let rounded = guess.round();
        if(fraction.x >= 0.5 && fraction.x < 0.667) {
            if(fraction.y >= 0.25 && fraction.y <= 0.5 && (fraction.y - 0.25)/(fraction.x - 0.5) > Vector.tan60) {
                rounded = rounded.add(new Vector(-1, 1));
            }
    
            if(fraction.y >= 0.5 && fraction.y <= 0.75 && (fraction.y - 0.75)/(fraction.x - 0.5) < -Vector.tan60) {
                rounded = rounded.add(new Vector(-1, 0));
            }
        } else if(fraction.x > 0.333 && fraction.x <= 0.5) {
            if(fraction.y >= 0.25 &&  fraction.y <= 0.5 && (fraction.y - 0.5)/(fraction.x - 0.333) > -Vector.tan60) {
                rounded = rounded.add(new Vector(1, 0));
            }
    
            if(fraction.y >= 0.5 && fraction.y <= 0.75 && (fraction.y - 0.5)/(fraction.x - 0.333) < Vector.tan60) {
                rounded = rounded.add(new Vector(1, -1));
            }
        }
        return rounded.add(new Vector(0, rounded.x));
    }

    static direction(l: number, a: number) {
        return new Vector(l * Math.cos(a), l * Math.sin(a));
    }

    public pack() {
        return (this.x + Vector.MAX) * (2 * Vector.MAX) + (this.y + Vector.MAX);
    }

    static lerp(v1: Vector, v2: Vector, t1: number, t2: number, t: number): Vector {
        return (v2.sub(v1)).scale(t / (t2 - t1));
    }

    static unpack(n: number) {
        return new Vector(
            Math.floor(n / (2 * Vector.MAX)) - Vector.MAX,
            (n % (2 * Vector.MAX)) - Vector.MAX
        );
    }

    public toString() {
        return `${this.x}, ${this.y}`;
    }
}

export default Vector;
