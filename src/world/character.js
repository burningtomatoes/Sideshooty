var Character = Class.extend({
    position: { x: 25, y: 155},
    movementSpeed: 1,
    jumpSpeed: 10,
    canJump: true,
    canFire: true,
    facingEast: true,
    velocity: { x: 0, y: 0 },
    size: { w: 15, h: 20 },
    txBody: new Image(),
    txBodyWhite: null,
    isVulnerable: true,
    hitBoxMargin: 3,

    isHurting: false,
    hurtCounter: 0,

    init: function() {
        this.movementSpeed = 1;
        this.jumpSpeed = 10;
        this.canJump = true;
        this.canFire = true;
        this.facingEast = true;
        this.velocity = { x: 0, y: 0 };
        this.size = { w: 15, h: 20 };
        this.hitBoxMargin = 3;

        this.isVulnerable = true;
        this.isHurting = false;
        this.hurtCounter = 0;

        this.txBody = new Image();
        this.txBody.onload = this.generateHurtSprite.bind(this);

        this.txBodyWhite = this.txBody; // avoid breakage, generateHurtSprite() will update this later
    },

    generateHurtSprite: function() {
        var canvas = document.createElement('canvas');
        var ctx = canvas.getContext('2d');

        canvas.width = this.size.w;
        canvas.height = this.size.h;

        ctx.drawImage(this.txBody, 0, 0, this.size.w, this.size.h);

        var spriteData = ctx.getImageData(0, 0, this.size.w, this.size.h);
        var pixelData = spriteData.data;

        var hurtColor = [255, 255, 255]; // RGB format

        // Iterate the pixels in the first frame of the sprite we just loaded.
        // Each pixel has 4 bytes of information: Red, Green, Blue and Alpha.
        for (var i = 0; i < pixelData.length; i += 4) {
            pixelData[i] = hurtColor[0];
            pixelData[i + 1] = hurtColor[1];
            pixelData[i + 2] = hurtColor[2];
            // Pixels that were not previously set should still have a zero alpha (invisible).
            // We don't change alpha (the 4th value) but leave it as is.
            // End result: the sprite, where pixels were already visible, will have our color.
        }

        spriteData.data = pixelData;
        ctx.putImageData(spriteData, 0, 0);

        this.txBodyWhite = canvas;
    },

    draw: function(ctx) {
        ctx.save();

        if (!this.facingEast) {
            ctx.translate(this.position.x + 16, this.position.y);
            ctx.scale(-1, 1);
        } else {
            ctx.translate(this.position.x, this.position.y);
        }

        ctx.drawImage(this.isHurting ? this.txBodyWhite : this.txBody, 0, 0, this.size.w, this.size.h, 0, 0, this.size.w, this.size.h);
        ctx.restore();

        if (window.DEBUG_PROJECTILES) {
            var sq = this.getRect();

            ctx.beginPath();
            ctx.rect(sq.left, sq.top, sq.width, sq.height);
            ctx.lineWidth = 1;
            ctx.strokeStyle = 'red';
            ctx.stroke();
        }
    },

    hurt: function() {
        if (!this.isVulnerable) {
            return;
        }

        Sfx.hurt();
           
        this.isHurting = true;
        this.hurtCounter = 2;
        //Map.remove(this);
    },

    update: function() {
        /*** Movement processing ***/
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
        this.velocity.y += Map.gravity;

        /*** Collision detection ***/
        var bounds = this.getRect();

        if (bounds.bottom > Renderer.canvas.height) {
            this.velocity.y = 0;
            this.position.y = Renderer.canvas.height - bounds.height;
            this.canJump = true; // restore jumping powers if we have landed safely
        }

        /*** Hurt animation ***/
        if (this.isHurting && this.hurtCounter <= 0) {
            this.isHurting = false;
        }
        else if (this.hurtCounter > 0) {
            this.hurtCounter--;
        }
    },

    getRect: function() {
        return {
            top: this.position.y,
            left: this.position.x + this.hitBoxMargin,
            height: this.size.h,
            width: this.size.w - (this.hitBoxMargin * 2),
            bottom: this.position.y + this.size.h,
            right: this.position.x + this.size.w - (this.hitBoxMargin * 2)
        };
    }
});