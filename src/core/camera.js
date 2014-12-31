var Camera = {
    x: 0,
    y: 0,
    smoothedX: 0,
    smoothedY: 0,

    isRumbling: false,
    rumbleOffset: 0,
    rumbleIntensity: 1,
    rumbleDuration: 0,

    trackingEntity: null,

    translateX: function(x) {
        return Math.round(x + Camera.smoothedX + Camera.rumbleOffset);
    },

    translateY: function(y) {
        return Math.round(y + Camera.smoothedY + Camera.rumbleOffset);
    },

    translateObject: function(obj) {
        return {
            x: Camera.translateX(obj.x),
            y: Camera.translateY(obj.y)
        };
    },

    rumble: function(duration, intensity) {
        Camera.isRumbling = true;
        Camera.rumbleOffset = 0;
        Camera.rumbleDuration = duration;
        Camera.rumbleIntensity = intensity;
    },

    track: function(entity) {
        this.trackingEntity = entity;
    },

    update: function() {
        if (Camera.isRumbling) {
            Camera.rumbleDuration--;

            Camera.rumbleOffset = Math.floor((Math.random() * Camera.rumbleIntensity) + 1) - Camera.rumbleIntensity;

            if (Camera.rumbleDuration <= 0) {
                Camera.isRumbling = false;
                Camera.rumbleOffset = 0;
            }
        }

        if (this.trackingEntity != null) {
            Camera.x = -(this.trackingEntity.position.x - (Renderer.canvas.width / 2));
            Camera.y = -(this.trackingEntity.position.y - (Renderer.canvas.height / 2));
        }

        Camera.smoothedX = MathHelper.lerp(Camera.smoothedX, Camera.x, 0.1);
        Camera.smoothedY = MathHelper.lerp(Camera.smoothedY, Camera.y, 0.1);
    }
};