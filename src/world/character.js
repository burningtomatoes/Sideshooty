var Character = Class.extend({
    position: { x: 25, y: 155},
    lastPosition: { x: 0, y: 0 },
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

    canMoveRight: false,
    canMoveLeft: false,

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

        this.canMoveRight = false;
        this.canMoveLeft = true;
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

    drawExtras: function(ctx) {
        // To be implemented by children where appropriate
    },

    draw: function(ctx) {
        if (this.dead) {
            ctx.drawImage(this.txCorpse, 0, 0, this.txCorpseSize.w, this.txCorpseSize.h, Camera.translateX(this.position.x), Camera.translateY(this.position.y - (this.txCorpseSize.h - this.size.h)), this.txCorpseSize.w, this.txCorpseSize.h);
            return;
        }

        ctx.save();

        if (!this.facingEast) {
            ctx.translate(Math.round(Camera.translateX(this.position.x + 16)), Math.round(Camera.translateY(this.position.y)));
            ctx.scale(-1, 1);
        } else {
            ctx.translate(Math.round(Camera.translateX(this.position.x)), Math.round(Camera.translateY(this.position.y)));
        }

        ctx.drawImage(this.isHurting ? this.txBodyWhite : this.txBody, 0, 0, this.size.w, this.size.h, 0, 0, this.size.w, this.size.h);

        this.drawExtras(ctx);

        ctx.restore();

        if (window.DEBUG_PROJECTILES && !this.dead) {
            var sq = this.getPreCollisionRect();

            ctx.beginPath();
            ctx.rect(Camera.translateX(sq.left), Camera.translateY(sq.top), sq.width, sq.height);
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
        knockbackVelocity += Math.random();

        if (toEast) {
            knockbackVelocity = -knockbackVelocity;
        }

        this.velocity.x = knockbackVelocity;
    },

    update: function() {
        this.lastPosition = { x: this.position.x, y: this.position.y };

        if (!this.canMoveLeft && this.velocity.x < 0) {
            this.velocity.x = 0;
        }

        if (!this.canMoveRight && this.velocity.x > 0) {
            this.velocity.x = 0;
        }

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

        /*** Collision detection with blocks ***/
        var characterBounds = this.getRect();
        var characterBoundsExtra = this.getPreCollisionRect();

        var rightBlocked = false;
        var leftBlocked = false;

        for (var i = 0; i < Map.entities.length; i++) {
            var entity = Map.entities[i];

            if (entity.isBlock) {
                var blockBounds = entity.getRect();

                entity.collisionStatus = 'none';

                // Vertical collision
                if (Utils.rectIntersects(characterBounds, blockBounds)) {
                    // Determine from what side we are colliding
                    if (this.velocity.y > 0) {
                        // We are on top, landing a jump
                        this.velocity.y = 0;
                        this.position.y = blockBounds.top - this.size.h;
                        this.canJump = true; // restore jumping powers if we have landed safely
                    }
                    else if (this.velocity.y < 0) {
                        this.velocity.y = 0;
                        this.position.y = blockBounds.top + this.size.h;
                        this.canJump = false;
                    }
                }

                // Horizontal collision
                var ix = false;
                if (Utils.rectIntersects(characterBoundsExtra, blockBounds)) {
                    if (blockBounds.top < characterBoundsExtra.bottom) {
                        ix = true;
                        entity.collisionStatus = 'intersects';

                        if (blockBounds.right < characterBounds.left) {
                            entity.collisionStatus = 'blocked';
                            leftBlocked = true;
                        }
                        else if (blockBounds.left < characterBoundsExtra.right) {
                            entity.collisionStatus = 'blocked';
                            rightBlocked = true;
                        }
                    }
                }
            }
        }

        this.canMoveLeft = !leftBlocked;
        this.canMoveRight = !rightBlocked;

        /*** Hurt animation ***/
        if (this.isHurting && this.hurtCounter <= 0) {
            this.isHurting = false;
        }
        else if (this.hurtCounter > 0) {
            this.hurtCounter--;
        }
    },

    getPreCollisionRect: function() {
        var baseRect = this.getRect();
        baseRect.left -= 5;
        baseRect.right += 5;
        baseRect.width += 10;
        return baseRect;
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