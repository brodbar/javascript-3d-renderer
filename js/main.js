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
            x: Math.sin(this.parameter),
            y: Math.cos(this.parameter),
            z: Math.sin(this.parameter) * Math.cos(this.parameter)
        }
    },
    parameter: 0
}

const cursorLock = [
    "pointerLockElement", "mozPointerLockElement", "webkitPointerLockElement"
].some(e => e in document);

const _Camera = new Camera(Graph.Scene, cursorLock);
_Camera.setPos(5, 0, 0)

function draw()
{
    _Camera.handleInput();
    Graph.Scene.context.clearRect(0, 0, Screen.width, Screen.height)
    for(let i = 0; i < 10e2; i++)
    {
        _Camera.sprayPoint(Graph.Equation());
        Graph.parameter += Math.PI / 144;
    }
}

_Timer.evoke(draw);
_Timer.start();