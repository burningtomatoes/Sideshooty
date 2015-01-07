window.DEBUG_PROJECTILES = false;

var Projectile = function(firedBy) {
    this.position = { x: 0, y: 0 };
    this.velocity = { x: 0, y: 0 };
    this.size = { w: 11, h: 7 };
    this.renderSize = { w: 6, h: 4 };
    this.firedBy = firedBy;
    this.lifetime = 30;

    this.txBody = new Image();
    this.txBody.src = 'assets/textures/bullet.png';

    this.configured = false;

    this.draw = function(ctx) {
        ctx.save();

        if (this.velocity.x < 0) {
            ctx.translate(Camera.translateX(this.position.x + this.renderSize.w), Camera.translateY(this.position.y));
            ctx.scale(-1, 1);
        } else {
            ctx.translate(Camera.translateX(this.position.x), Camera.translateY(this.position.y));
        }

        ctx.drawImage(this.txBody, 0, 0, this.size.w, this.size.h, 0, 0, this.renderSize.w, this.renderSize.h);
        ctx.restore();

        if (window.DEBUG_PROJECTILES) {
            var sq = this.getRect();

            ctx.beginPath();
            ctx.rect(Camera.translateX(sq.left), Camera.translateY(sq.top), sq.width, sq.height);
            ctx.lineWidth = 1;
            ctx.strokeStyle = 'yellow';
            ctx.stroke();
        }
    };

    this.update = function() {
        if (!this.configured) {
            this.velocity.x += Math.random() - 0.5;
            this.velocity.y += Math.random() - 0.5;
            this.configured = true;
        }

        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        /*** Check collisions with entities ***/
        var ourBox = this.getRect();

        for (var i = 0; i < Map.entities.length; i++) {
            var entity = Map.entities[i];

            if (entity === this.firedBy) {
                // The entity that fired a projectile can never be harmed by itself.
                // For now at least.
                continue;
            }

            if (entity.isBlock) {
                var boundingBox = entity.getRect();

                if (Utils.rectIntersects(ourBox, boundingBox)) {
                    Map.remove(this);
                    return;
                }
            } else {
                if (!entity.isVulnerable || entity.dead) {
                    // Probably a projectile. Or a corpse. Or something.
                    continue;
                }

                var boundingBox = entity.getRect();

                if (Utils.rectIntersects(ourBox, boundingBox)) {
                    entity.hurt(this, 25);

                    Map.remove(this);
                    return;
                }
            }
        }

        /*** Lifetime management ***/
        if (this.lifetime > 0) {
            this.lifetime--;
        } else {
            Map.remove(this);
            return;
        }
    };

    this.getRect = function() {
        return {
            top: this.position.y,
            left: this.position.x,
            height: this.renderSize.h,
            width: this.renderSize.w,
            bottom: this.position.y + this.renderSize.h,
            right: this.position.x + this.renderSize.w
        };
    };
};