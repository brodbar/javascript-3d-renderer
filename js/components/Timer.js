export class Timer {
    constructor(deltaTime = 1/60) {
        let lastTime;
        let accumulatedTime = 0;
        this.queued = false;

        this.update = (time) => {
            if(lastTime) {
                accumulatedTime += (time - lastTime) / 1000;
                while(accumulatedTime > deltaTime) {
                    this.callback(deltaTime);
                    accumulatedTime -= deltaTime;
                }
            }
            lastTime = time;
            this.enqueue();
        }
    }

    evoke(callback) {
        this.callback = callback;
        this.start();
    }

    enqueue() {
        if (this.queued !== false)
            this.queued = requestAnimationFrame(this.update);
    }

    start() {
        this.queued = true;
        this.enqueue();
    }

}
