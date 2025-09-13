class View {
    // Very Temporary Constructor later will be probably replaced with sprites and other stuff
    constructor(r, g, b, name){
        this.r = r;
        this.g = g;
        this.b = b;
        this.name = name;
    }

    draw() {
        push();
        
        fill(this.r, this.g, this.b);
        noStroke();
        rect(0, 0, width, height);

        fill(0, 0, 0);
        textAlign(CENTER, CENTER);
        textSize(50);
        text(this.name , width/2, height/2);
        
        pop();
    }

    // These two will be changed later on, so far this was just a quick and easy solution so yeah
    // Might just add small internal renderer for those two, so the code is not as repetetive
    onEnter() {}
    onExit() {}

}

class ViewManager {
    constructor() {
        this.Views = [];
        this._currentView = 0;
    }

    addView(obj) {
        // If its first View of the Room
        if(this.Views.length == 0){
            R.add(obj);
            obj.onEnter();
        }
        this.Views.push(obj);
    }

    // Switches between the screens
    keyPressed(){
        const current = this.Views[this._currentView];
        if (keyCode === LEFT_ARROW) {
            R.remove(current);
            current.onExit();
            this._currentView--;
            if(this._currentView < 0) this._currentView = (this.Views.length - 1);
            let next = R.add(this.Views[this._currentView]);
            next.onEnter();
        }
        else if (keyCode === RIGHT_ARROW) {
            R.remove(current);
            current.onExit();
            this._currentView++;
            this._currentView = this._currentView % this.Views.length;
            let next = R.add(this.Views[this._currentView]);
            next.onEnter();
        }
    }

}

