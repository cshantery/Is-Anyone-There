let fileCabinet;

function loadSprites() {
    SM.add("FileCabinet", loadImage('assets/testObjects/filecabinet.png'));
    SM.add("NorthWall", loadImage('assets/demoRoom/PCWall.webp')); 
    SM.add("pinpad", loadImage('assets/testObjects/pinpad.png'));
    SM.add("SouthWall", loadImage('assets/SouthWall.png'))
    SM.add("WestWall", loadImage('assets/WestWall.png'))

    SM.add("FileCabinet1", loadImage('assets/testObjects/filecabinet.png'));
    SM.add("FileCabinet2", loadImage('assets/testObjects/filecabinet.png'));
    SM.add("FileCabinet3", loadImage('assets/testObjects/filecabinet.png'));
    SM.add("FileCabinet4", loadImage('assets/testObjects/filecabinet.png'));

    SM.add("secondNumber", loadImage('assets/object/secondNumber.png'));
    SM.add("screen", loadImage('assets/object/screen.webp'));

    SM.add("SlidingDoor1", loadImage('assets/object/SlidingDoor1.svg'));
    SM.add("SlidingDoor2", loadImage('assets/object/SlidingDoor2.svg'));
    SM.add("SlidingDoor3", loadImage('assets/object/SlidingDoor3.svg'));
    SM.add("SlidingDoor4", loadImage('assets/object/SlidingDoor4.svg'));
}

class SpriteManager {
    constructor() {
        this.sprites = new Map();
    }

    add(name, img) {
        const sprite = new Sprite(img);
        this.sprites.set(name, sprite);
    }

    get(name) {
        return this.sprites.get(name);
    }
}

class Sprite {
    constructor(src, x = 0, y = 0, scale = 1) {
        this.src = src;
        this.x = x;
        this.y = y;
        this.scale = scale / 100;
        this.customSize = null;
    }

    clone() {
        const copy = new Sprite(this.src);
        copy.x = this.x;
        copy.y = this.y;
        copy.scale = this.scale * 100; // convert back to original scale
        if (this.customSize) {
            copy.customSize = { ...this.customSize };
        }
        return copy;
    }

    setScale(scale) {
        this.scale = scale / 100;
        this.customSize = null;
    }

    setSize(w, h) {
        this.customSize = { w, h};
    }

    setPos(x, y) {
        this.x = x;
        this.y = y; 
    }

    getNativeSize() {
        return [this.src.width, this.src.height];
    }

    getVirtualSize() {
        const u = VM.u();
        const v = VM.v();
        const dpr = pixelDensity(); // or window.devicePixelRatio
        return [
            (this.src.width / dpr) * this.scale / u,
            (this.src.height / dpr) * this.scale / v
        ];
    }

    draw() {
        const u = VM.u();
        const v = VM.v();

        let w, h
        if (this.customSize) {
            w = this.customSize.w * u;
            h = this.customSize.h * v;
        } else {
            w = this.src.width * this.scale * u;
            h = this.src.height * this.scale * v;
        }

        push();
        image(this.src, this.x * u, this.y * v, w, h )
        pop();
    }

    update(dt) {

    }
}