import { Canvas } from './components/Canvas.js';
import { Camera } from './components/Camera.js';
import { Timer } from './components/Timer.js';

const Screen = {width: window.screen.availWidth, height: window.screen.availHeight}
const _Timer = new Timer();
const Scene = new Canvas(Screen.width, Screen.height);
Scene.append();
const Graph = {
    Scene,
    Equation: function() {
        return {
            x: Math.sin(this.parameter), //(1 + 0.25*cos(75t))*cost
            y: Math.cos(this.parameter),
            z: Math.cos(this.parameter) * Math.sin(this.parameter)
        }
    },
    parameter: 0,
    points: []
}

const cursorLock = [
    "pointerLockElement", "mozPointerLockElement", "webkitPointerLockElement"
].some(e => e in document);

const _Camera = new Camera(Graph.Scene, cursorLock);
_Camera.setPos(10, 0, 0);

for(let i = 0; i < 1000; i++)
{
    Graph.points.push(Graph.Equation())
    Graph.parameter += Math.PI / 288;
}

function draw()
{
    _Camera.handleInput();
    Graph.Scene.context.clearRect(0, 0, Screen.width, Screen.height);
    for(let point of Graph.points)
    {
        _Camera.sprayPoint(point);
    }
}

_Timer.evoke(draw);
_Timer.start();