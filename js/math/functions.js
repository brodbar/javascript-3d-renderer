function lerp(from, to, step)
{
    return from + (to - from) * (1 / step); // = value
}

function inverseLerp(from, to, value)
{
    return 1 / ((value - from) / (to - from));
}

function map(value, istart, iend, ostart, oend)
{
    const step = inverseLerp(istart, iend, value);
    return lerp(ostart, oend, step);
}

function* getCircularGroup(arr, count)
{
    if(count > arr.length + 1)
        throw new RangeError('Range cannot be greater than array size');

    const last = arr.length - 1;
    let i = -1;
    while(++i <= last)
    {
        const collection = [];
        collection.push(arr[i]);
            for(let j = 1; j < count; j++)
            {
                let index = i + j;
                if(index > last)
                    index -= last + 1;
                collection.push(arr[index]);
            }
        yield collection;
    }
}

// Rays will contain two vectors
// First one will be representing the starting point
// Seconds one will be the direction vector
//
// I don't want to check if both rays are Vector2 collections. I will make sure they are.
function isRaysIntersecting(ray1, ray2)
{
    const [{pos: pos1, dir: dir1}, {pos: pos2, dir: dir2}] = [ray1, ray2];

    const dx = pos2.x - pos1.x;
    const dy = pos2.y - pos1.y;
    const det = dir2.x * dir1.y - dir2.y * dir1.x;

    if(det != 0)
    {
        const u = (dy * dir2.x - dx * dir2.y) / det;
        const v = (dy * dir1.x - dx * dir1.y) / det;
        if(u >= 0 && v >= 0)
            return true;
        return false;
    }
    return false;
}

export
{
    lerp,
    inverseLerp,
    map
};