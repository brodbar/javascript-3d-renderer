const { PI, sin, cos, atan2, sqrt} = Math;

class Vector2
{
    static get ZERO()
    {
        return new Vector2(0, 0);
    }

    static isVec2(vec)
    {
        if(!vec instanceof Vector2)
            throw new Error('Argument must be passed as a Vector2 class');
    }

    static UNIT(angle)
    {
        const radian = angle * PI / 180;
        return new Vector2
        (
            cos(radian),
            sin(radian)
        );
    }

    static from(vec)
    {
        Vector2.isVec2(vec);
        return new Vector2(vec.x, vec.y);
    }

    static add = function(vectors)
    {
        const base = Vector2.ZERO;
        vectors.forEach(vec => base.add(vec));
        return base;
    }

    /**
     * 
     * @param {float} x 
     * @param {float} y 
     */
    constructor(x = 0, y = 0)
    {
        this.x = x;
        this.y = y;
    }

    get inverse()
    {
        return new Vector2(-this.x, -this.y);
    }

    /**
     * 
     * @param {Vector2} vector 
     * @returns {float}
     */
    dist(vector)
    {
        Vector2.isVec2(vector);
        const [{x: x1, y: y1}, {x: x2, y: y2}] = [this, vector];
        return sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
    }

    /**
     * 
     * @param {float} x 
     * @param {float} y 
     */
    set(x, y)
    {
        this.x = x;
        this.y = y;
    }

    add(vector)
    {
        Vector2.isVec2(vector);
        this.x += vector.x;
        this.y += vector.y;
    }

    /**
     * 
     * @param {boolean} alter - Returns a new Vector2 class if true
     */
    normalize(alter = true)
    {
        const vectorLength = this.length;
        if(!alter)
        {
            return new Vector2(this.x / vectorLength, this.y / vectorLength);
        }
        this.x /= vectorLength;
        this.y /= vectorLength;
    }

    /**
     * 
     * @param {float} angle Angle must be in degrees
     */
    rotate(angle)
    {
        const radian = angle * PI / 180;
        const x = this.x * cos(radian) - this.y * sin(radian);
        const y = this.x * sin(radian) + this.y * cos(radian);
        this.x = x;
        this.y = y;
    }

    get length()
    {
        return sqrt(this.x ** 2 + this.y ** 2);
    }

    get degree()
    {
        const radian = this.radian;
        return radian < 0 ? radian + 360 : radian;
    }

    get radian()
    {
        return atan2(this.y, this.x);
    }
}

export { Vector2 };