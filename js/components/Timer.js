export class Timer {
    constructor(deltaTime = 1/60) {
        this.lastTime;
        this.accumulatedTime = 0;
        this.tick = 0;

        this.update = (time) => {
            if(this.lastTime) {
                this.accumulatedTime += (time - this.lastTime) / 1000;
                while(this.accumulatedTime > deltaTime) {
                    this.callback(deltaTime);
                    this.accumulatedTime -= deltaTime;
                    this.tick++;
                    if(this.tick > 150)
                    {
                        this.pause();
                        return;
                    }
                }
            }
            this.lastTime = time;
            this.enqueue();
        }

        ["keydown", "mousemove", "mousedown"].forEach(e => {
            window.addEventListener(e, () => {
                this.tick = 0;
                if(this.paused)
                {
                    this.paused = false;
                    this.start();
                }
            });
        });
    }

    evoke(callback) {
        this.callback = callback;
        this.start();
    }

    enqueue() {
        requestAnimationFrame(this.update);
    }
    
    pause()
    {
        this.lastTime = 0;
        this.accumulatedTime = 0;
        this.paused = true;
    }

    start() {
        this.enqueue();        
    }
}
