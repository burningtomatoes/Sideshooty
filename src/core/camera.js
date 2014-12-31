var Camera = {
    x: 0,
    y: 0,

    isRumbling: false,
    rumbleOffset: 0,
    rumbleIntensity: 1,
    rumbleDuration: 0,

    translateX: function(x) {
        return x + this.x + this.rumbleOffset;
    },

    translateY: function(y) {
        return y + this.y + this.rumbleOffset;
    },

    translateObject: function(obj) {
        return {
            x: this.translateX(obj.x),
            y: this.translateY(obj.y)
        };
    },

    rumble: function(duration, intensity) {
        this.isRumbling = true;
        this.rumbleOffset = 0;
        this.rumbleDuration = duration;
        this.rumbleIntensity = intensity;
    },

    update: function() {
        if (this.isRumbling) {
            this.rumbleDuration--;

            this.rumbleOffset = Math.floor((Math.random() * this.rumbleIntensity) + 1) - this.rumbleIntensity;

            if (this.rumbleDuration <= 0) {
                this.isRumbling = false;
                this.rumbleOffset = 0;
            }
        }
    }
};