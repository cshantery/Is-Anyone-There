let fileCabinet;

function loadSprites() {
    SM.add("FileCabinet", loadImage('assets/testObjects/filecabinet.png'));
    SM.add("NorthWall", loadImage('assets/testObjects/NorthWall.png')); 
    SM.add("pinpad", loadImage('assets/testObjects/pinpad.png'));
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