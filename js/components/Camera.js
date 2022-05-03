import { Vector3, Vector2 } from './Vector.js';
import { Plane } from './Plane.js';
import { Line } from '../components/Line.js';
import { Input } from './Input.js';
import { map } from '../math/functions.js';

export class Camera
{
    #position;
    #rotation;
    #distance;
    #observer;
    #initNormal;
    #normal;
    #keys;
    #input;

    constructor(Scene, cursorLock)
    {
        this.width = Scene.width;
        this.height = Scene.height;
        this.scene = Scene;
        this.aspectRatio = this.height / this.width;
        this.#distance = 1;
        this.#observer = Vector3.ZERO;
        this.#position = Vector3.ZERO;
        this.#initNormal = new Vector3(1, 0, 0);
        this.#normal = this.#initNormal;
        this.#rotation = { "y": 0, "z": 0 };
        this.borders = {};
        this.#keys = new Map([
            ["Space",       "MoveUp"],
            ["ShiftLeft",   "MoveDown"],
            ["KeyW",        "MoveForward"],
            ["KeyD",        "MoveRight"],
            ["KeyS",        "MoveBackward"],
            ["KeyA",        "MoveLeft"]
        ]);
        this.locateScreenPlane();
        this.locateObserver();
        this.init(cursorLock);
    }

    get normal() { return this.#normal; }

    get pos() { return this.#position; }

    get xAxis() { return this.#normal; }

    get yAxis()
    {
        let zsim = new Vector3(0, 0, 1);
        zsim.rotate(this.#rotation.y, this.#rotation.z);
        return zsim.crossProduct(this.xAxis, true);
    }

    get zAxis() { return this.xAxis.crossProduct(this.yAxis, true); }
    
    get planes()
    {
        return {
            "xy": new Plane(this.zAxis, Vector3.ZERO),
            "xz": new Plane(this.yAxis, Vector3.ZERO),
            "yz": new Plane(this.xAxis, Vector3.ZERO)
        };
    }

    get observer(){ return this.#observer; }

    handleInput()
    {
        for(let key of this.#keys.keys())
            if(this.#input.getKeyState(key))
                this.move(this.#keys.get(key));
    }
    
    init(lockEnabled)
    {
        this.#input = new Input(true);
        this.#input.listen(document);
        this.drag = true;
        
        for(let key of this.#keys.keys())
            this.#input.addMap(key);

        document.addEventListener('mousemove', e => {
            if(this.drag)
            {
                let zRotation = map(-e.movementX, 0, this.width / 2, 0, 45);
                let yRotation = map(-e.movementY, 0, this.width / 2, 0, 45);
                this.addRotation(yRotation, zRotation);
            }
        });

        if(!lockEnabled)
        {
            this.drag = false;
            document.addEventListener('mouseup', e => {
                this.drag = false;
            });
        } else {
            this.scene.canvas.requestPointerLock = this.scene.canvas.requestPointerLock ||
            this.scene.canvas.mozRequestPointerLock ||
            this.scene.canvas.webkitRequestPointerLock;
            document.addEventListener('mousedown', e => {
                this.drag = true;
                this.scene.canvas.requestPointerLock();
            });
        };
        
    }

    locateScreenPlane()
    {
        this.screenPlane = new Plane(this.#normal, this.#position);
        return this.screenPlane;
    }

    locateObserver()
    {
        this.#observer = Vector3.add(this.#position, Vector3.mult(this.#normal, this.#distance));
        this.borders.bottom = new Plane(
            this.zAxis,
            Vector3.add(this.pos, Vector3.mult(this.zAxis, -0.5 * this.aspectRatio))
        );
        this.borders.left = new Plane(
            this.yAxis,
            Vector3.add(this.pos, Vector3.mult(this.yAxis, -0.5))
        );
        this.borders.top = new Plane(
            Vector3.mult(this.zAxis, -1),
            Vector3.add(this.pos, Vector3.mult(this.zAxis, 0.5 * this.aspectRatio))
        );
        this.borders.right = new Plane(
            Vector3.mult(this.yAxis, -1),
            Vector3.add(this.pos, Vector3.mult(this.yAxis, 0.5))
        );
    }

    isPointVisible(point, projectedPoint)
    {
    return this.borders.bottom.dotProduct(projectedPoint, true) >= 0 &&
        this.borders.left.dotProduct(projectedPoint, true) >= 0 &&
        this.screenPlane.dotProduct(point) <= 0 &&
        this.screenPlane.dotProduct(point) <= 0
    }

    getProjectedPoint(point)
    {
        const observerRay = new Line(this.observer, point);
        const param = observerRay.findParameter(this.screenPlane.coefficients);
        return observerRay.generatePoint(param);
    }
/*
 let point = new Vector3(
    Math.sin(t),
    Math.cos(t),
    Math.sin(t) * Math.cos(t)
);
let projectedPoint = _Camera.getProjectedPoint(point);
let x = _Camera.borders.left.distance(projectedPoint);
let y = _Camera.borders.bottom.distance(projectedPoint);
if(_Camera.isPointVisible(point, projectedPoint))
{
    const camDist = _Camera.observer.distance(point);
    Scene.arc(
        x * Scene.width / 1,
        Scene.height - y * Scene.height / (1 * _Camera.aspectRatio),
        (Screen.width / 100) * (Screen.height / 100) / (camDist || 1),
        "#646432"
    );
}
*/
    createPoint(point)
    {
        const projection = this.getProjectedPoint(point);
        return {
            initial: point,
            projection,
            x: this.borders.left.distance(projection),
            y: this.borders.bottom.distance(projection),
            visible: this.isPointVisible(point, projection)
        };
    }

    sprayPoint(vec)
    {
        const point = this.createPoint(vec);
        if(point.visible)
        {
            const camDist = this.observer.distance(point.initial);
            this.scene.arc(
                point.x * this.width / 1,
                this.height - point.y * this.height / (1 * this.aspectRatio),
                (this.width / 100) * (this.height / 100) / (camDist || 1),
                "#646432"
            );
        }
    }

    move(opt)
    {
        const func = {
            "MoveForward": () => this.addPos(this.xAxis.reverse.mult(0.01)),
            "MoveRight": () => this.addPos(this.yAxis.mult(0.01)),
            "MoveBackward": () => this.addPos(this.xAxis.mult(0.01)),
            "MoveLeft": () => this.addPos(this.yAxis.reverse.mult(0.01)),
            "MoveUp": () => this.addPos(new Vector3(0, 0, 0.01)),
            "MoveDown": () => this.addPos(new Vector3(0, 0, -0.01)),
        }
        func[opt]?.();
    }

    setPos(x, y, z)
    {
        this.#position.set(x, y, z);
        this.locateObserver();
        this.locateScreenPlane();
    }

    addPos({x, y, z})
    {
        this.#position.x += x;
        this.#position.y += y;
        this.#position.z += z;
        this.locateObserver();
        this.locateScreenPlane();
    }

    setRotation(y, z)
    {
        this.#rotation = { y, z };
        this.#normal = Vector3.rotate(y, z, this.#initNormal);
        this.locateObserver();
        this.locateScreenPlane();
    }

    addRotation(y, z)
    {
        this.setRotation(this.#rotation.y + y, this.#rotation.z + z);
        this.locateObserver();
        this.locateScreenPlane();
    }

    getRotation() { return this.#rotation; }
}