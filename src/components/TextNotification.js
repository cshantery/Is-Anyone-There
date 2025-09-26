class DisplayText{
    /*
    General class for displaying simple, non-clickable text on the screen.

    For now aligns x,y to be upper left corner of text
    */
    constructor(x, y, content, size){
        this.x = x
        this.y = y
        this.content = content
        this.size = size

        this.alpha = 255
    }

    draw(){
        const u = VM.u();
        const v = VM.v();

        push()
        noStroke()
        textSize(this.size*(u/100))
        textAlign(LEFT, TOP)
        
        // --- temporary bit for visibility - NOT PART OF ACTUAL DISPLAYTEXT CLASS
        let w = textWidth(this.content);
        let h = textAscent() + textDescent();
        fill(0, 204, 102, 50)
        rect(this.x*u-10, this.y*v-10, w+20, h+20, 8)

        // ---
        fill(0, 0, 0, this.alpha)
        text(this.content, this.x*u, this.y*v)
        pop()
    }

    // getters
    setAlpha(alpha){ this.alpha = alpha }
    getAlpha(){ return this.alpha }
}

class TextNotificationHandler {
    /**
     * Class for handling fading notifications.
     * 
     * For now, only handles a single text message (plan to maybe do multiple).
     * 
     * Also for now, the view that uses this class must call TextNotificationHandler.update(dt) in its update.
     * 
     * cleanup() must be called in the onExit of the view to remove all notifications.
     * 
     * @param {Number} x - x coordinate to place text
     * @param {Number} y - y coordinate to place text
     * @param {Number} z_ind - z index
     * @param {Number} fadeoutRate - how fast the text will fade, must be in range (0,1), lower => slower
     */
    constructor(x, y, zind=100, fadeoutRate=0.03){
        this.x = x;
        this.y = y;
        this.z_index = zind;
        this.fadeoutRate = fadeoutRate

        this.size = 26; // just have it as constant so it's uniform across all views
        this.alphaCutoff = 5; // remove text notif when alpha less than this value

        this.text = null
        this.timer = 0
        this.fadeoutLocket = true
        this.holdFadeout = true;
    }

    update(dt){
        if(this.text != null){ // only start updates and timers if the text has been set 

            // holds the fadeout effect for 1 second
            if(this.holdFadeout){
                this.timer += dt

                if(this.timer > 1){
                    this.holdFadeout = false
                }
            }
            
            /* Fadeout logic, expoentially decay alpha value for text. If alpha gets too low (30 for now), make text disappear (looks smoother this way) */
            if(!this.holdFadeout){
                this.text.setAlpha(this.text.getAlpha()*(1-this.fadeoutRate)) // new_alpha = old_alpha * (1-fadeout_rate)

                if(this.text.getAlpha() < this.alphaCutoff){
                    this.cleanup()
                    this.holdFadeout = true
                }
            }
        }
    }

    // add text at position specified at constructor
    addText(text){
        if(this.text == null){
            this.text = new DisplayText(this.x, this.y, text, this.size)
            R.add(this.text, this.zind)
        }
        /* If we tried to addText again (so if a user clicks what caused the notification), then it will reset timers so the notification
        stays for a bit longer.
         */
        else{
            this.timer = 0
            this.holdFadeout = true
            this.text.setAlpha(255)
        }
    }

    // call this in onExit in your view.
    cleanup(){
        R.remove(this.text)
        this.text = null
    }

}