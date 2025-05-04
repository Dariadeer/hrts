class Vector {

    private static MAX = 10e6; // for integer vectors

    public static zero = new Vector(0, 0);
    public static up = new Vector(0, 1);
    public static right = new Vector(1, 0);
    public static down = new Vector(0, -1);
    public static left = new Vector(-1, 0);

    public static sin30 = Math.sin(Math.PI / 6);
    public static sin60 = Math.sin(Math.PI / 3);

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

    public components(): [number, number] {
        return [this.x, this.y];
    }

    public toHex(r: number) {
        return new Vector((1 + Vector.sin30) * r * this.x, Vector.sin60 * (2 * this.y - this.x) * r);
    }

    static direction(l: number, a: number) {
        return new Vector(l * Math.cos(a), l * Math.sin(a));
    }

    public pack() {
        return (this.x + Vector.MAX) * (2 * Vector.MAX) + (this.y + Vector.MAX);
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
