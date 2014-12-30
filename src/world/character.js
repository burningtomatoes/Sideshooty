var Character = Class.extend({
    position: { x: 25, y: 155},
    velocity: { x: 0, y: 0 },
    facingEast: true,

    movementSpeed: 1,
    jumpSpeed: 10,

    canJump: true,
    canFire: true,

    size: { w: 15, h: 20 },
    txBody: new Image(),
    txBodyWhite: null,
    txCorpse: null,
    txCorpseSize: { w: 25, h: 9 },

    isVulnerable: true,
    hitBoxMargin: 3,
    isHurting: false,
    hurtCounter: 0,
    healthNow: 0,
    healthMax: 100,
    dead: false,

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
        this.healthMax = 100;
        this.healthNow = this.healthMax;
        this.dead = false;

        this.txBody = new Image();
        this.txBody.onload = this.generateHurtSprite.bind(this);

        this.txBodyWhite = this.txBody; // avoid breakage, generateHurtSprite() will update this later

        this.txCorpse = new Image();
        this.txCorpse.src = 'assets/textures/enemy_dead.png';
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
        if (this.dead) {
            ctx.drawImage(this.txCorpse, 0, 0, this.txCorpseSize.w, this.txCorpseSize.h, this.position.x, this.position.y - (this.txCorpseSize.h - this.size.h), this.txCorpseSize.w, this.txCorpseSize.h);
            return;
        }

        ctx.save();

        if (!this.facingEast) {
            ctx.translate(this.position.x + 16, this.position.y);
            ctx.scale(-1, 1);
        } else {
            ctx.translate(this.position.x, this.position.y);
        }

        ctx.drawImage(this.isHurting ? this.txBodyWhite : this.txBody, 0, 0, this.size.w, this.size.h, 0, 0, this.size.w, this.size.h);
        ctx.restore();

        if (window.DEBUG_PROJECTILES && !this.dead) {
            var sq = this.getRect();

            ctx.beginPath();
            ctx.rect(sq.left, sq.top, sq.width, sq.height);
            ctx.lineWidth = 1;
            ctx.strokeStyle = 'red';
            ctx.stroke();
        }
    },

    hurt: function(projectile, damage) {
        if (!this.isVulnerable || this.dead) {
            return;
        }

        if (damage > 0) {
            Sfx.hurt();

            this.isHurting = true;
            this.hurtCounter = 2;
            this.healthNow -= damage;

            if (this.healthNow <= 0) {
                this.die();
            }
        }

        this.knockBack(1, projectile.velocity.x < 0);
    },

    jump: function() {
        this.velocity.y = -this.jumpSpeed;
        this.canJump = false;

        if (this === Map.player) {
            Sfx.jump();
        }
    },

    die: function() {
        this.dead = true;
        this.healthNow = 0;
    },

    knockBack: function(knockbackVelocity, toEast) {
        if (toEast) {
            knockbackVelocity = -knockbackVelocity;
        }

        this.velocity.x = knockbackVelocity;
    },

    update: function() {
        /*** Movement processing ***/
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        // Downward gravity
        this.velocity.y += Map.gravity;

        // Sideways gravity (for knockbacks etc)
        if (this.velocity.x > 0) {
            this.velocity.x -= Map.gravity / 2;

            if (this.velocity.x < 0) {
                this.velocity.x = 0;
            }
        } else if (this.velocity.x < 0) {
            this.velocity.x += Map.gravity / 2;

            if (this.velocity.x > 0) {
                this.velocity.x = 0;
            }
        }

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