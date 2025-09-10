class Renderer {
    constructor() {
        // objects to render
        this.objects = [];

        // Objects queued to delete
        this._objectsToRemove = new Set();
    }

    // Adds an object to list of things to render
    add(obj) {
        this.objects.push(obj);
        return obj;
    }

    // removes an object
    remove(obj) {
        this._objectsToRemove.add(obj);
        this._deleteObjects();
    }

    // Safley self removes
    selfRemove(obj) {
        this._objectsToRemove.add(obj)
    }

    // checks if theres anything in objects to delete and deletes them
    _deleteObjects(){
        if (this._objectsToRemove.size === 0) 
            return;
        this.objects = this.objects.filter(o => !this._objectsToRemove.has(o));
        this._objectsToRemove.clear();
    }

    update(dt) {
        // Checks each object for a update function
        // if objects contains one, calls it
        for (const o of this.objects) {
            if (typeof o.update === "function") o.update(dt);
        }
        
        // Deletes Objects on update
        this._deleteObjects();
    }

    draw() {
        // Same idea as update
        for (const o of this.objects) {
            if (typeof o.draw === "function") o.draw();
        }
    }

    // used for caputring mousePresses or Keyboard Events
    dispatch(methodName, ...args) {
        for (const o of this.objects) {
            const fn = o[methodName];
            if (typeof fn === "function") fn.apply(o, args);
        }

        this._deleteObjects();
    }

    // Clears everything in the Renderer
    clear(){
        this.objects.length = 0;
        this._objectsToRemove.clear();
    }
}
