/*
    No need to calculate rotation angles
*/
class Vector2
{
    constructor()
    {

    }
}

class Vector3
{
    static get ZERO()
    {
        return new Vector3(0, 0, 0);
    }

    static from({x, y, z})
    {
        return new Vector3(x, y, z);
    }

    static mult(vec, value)
    {
        return new Vector3(vec.x * value, vec.y * value, vec.z * value);
    }

    static sub(a, b)
    {
        return new Vector3(b.x - a.x, b.y - a.y, b.z - a.z);
    }

    static add(a, b)
    {
        return new Vector3(b.x + a.x, b.y + a.y, b.z + a.z);
    }

    static distance(a, b)
    {
        return Vector3.length(Vector3.sub(a, b));
    }

    static length(vec)
    {
        const { x, y, z } = vec;
        return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2) + Math.pow(z, 2));
    }

    static rotate(yAxis, zAxis, vec)
    {
        const sin = (deg) => Math.sin(deg * Math.PI / 180);
        const cos = (deg) => Math.cos(deg * Math.PI / 180);
        let x = vec.x * cos(zAxis) * cos(yAxis) - vec.y * sin(zAxis) + vec.z * cos(zAxis) * sin(yAxis);
        let y = vec.x * sin(zAxis) * cos(yAxis) + vec.y * cos(zAxis) + vec.z * sin(zAxis) * sin(yAxis);
        let z = -vec.x * sin(yAxis) + vec.z * cos(yAxis);
        return new Vector3(x, y, z);
    };

    /**
     * 
     * @param { float } x 
     * @param { float } y 
     * @param { float } z 
     */
    constructor(x, y, z = 0)
    {
        this.set(x, y, z);
    }

    get length() 
    {
        return Vector3.length(this);
    }

    get unit()
    {
        const { length } = this;
        return Vector3.mult(this, 1 / length);
    }
    
    set(x, y, z)
    {
        Object.assign(this, {x, y, z});
    }

    sub(vec)
    {
        this.x -= vec.x;
        this.y -= vec.y;
        this.z -= vec.z;
    }

    add(vec)
    {
        this.x += vec.x;
        this.y += vec.y;
        this.z += vec.z;
    }

    distance(point)
    {
        return Vector3.distance(this, point);
    }

    get reverse()
    {
        return Vector3.mult(this, -1);
    }


    mult(value)
    {
        return new Vector3(this.x * value, this.y * value, this.z * value);
    }

    rotate(yAxis, zAxis)
    {
        if(isNaN(yAxis * zAxis))
            throw new TypeError(`Undefined argument in { yAxis: ${yAxis}, zAxis: ${zAxis} }`);
        
        const sin = (deg) => Math.sin(deg * Math.PI / 180);
        const cos = (deg) => Math.cos(deg * Math.PI / 180);
        const {x, y, z} = this;
        this.x = x * cos(zAxis) * cos(yAxis) - y * sin(zAxis) + z * cos(zAxis) * sin(yAxis);
        this.y = x * sin(zAxis) * cos(yAxis) + y * cos(zAxis) + z * sin(zAxis) * sin(yAxis);
        this.z = -x * sin(yAxis) + z * cos(yAxis);
    }

    dotProduct(point, sign = false)
    {
        let dot = this.x * point.x + this.y * point.y + this.z * point.z;
        return sign ? Math.sign(dot) : dot;
    }

    crossProduct(vec, unit = false)
    {
        
        let x = this.y * vec.z - this.z * vec.y;
        let y = this.z * vec.x - this.x * vec.z;
        let z = this.x * vec.y - this.y * vec.x;
        let res = new Vector3(x, y, z);
            
        return unit ? res.unit : res;
    }
}

export { Vector2, Vector3 };
