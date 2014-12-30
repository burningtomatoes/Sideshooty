window.DEBUG_PROJECTILES = true;

var Projectile = function(firedBy) {
    this.position = { x: 0, y: 0 };
    this.velocity = { x: 0, y: 0 };
    this.size = { w: 11, h: 7 };
    this.renderSize = { w: 6, h: 4 };
    this.firedBy = firedBy;

    this.txBody = new Image();
    this.txBody.src = 'assets/textures/bullet.png';

    this.draw = function(ctx) {
        ctx.save();

        if (this.velocity.x < 0) {
            ctx.translate(this.position.x + this.renderSize.w, this.position.y);
            ctx.scale(-1, 1);
        } else {
            ctx.translate(this.position.x, this.position.y);
        }

        ctx.drawImage(this.txBody, 0, 0, this.size.w, this.size.h, 0, 0, this.renderSize.w, this.renderSize.h);
        ctx.restore();

        if (window.DEBUG_PROJECTILES) {
            var sq = this.getRect();

            ctx.beginPath();
            ctx.rect(sq.left, sq.top, sq.width, sq.height);
            ctx.lineWidth = 1;
            ctx.strokeStyle = 'yellow';
            ctx.stroke();
        }
    };

    this.update = function() {
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        /*** Check collisions with entities ***/
        var ourBox = this.getRect();

        for (var i = 0; i < Map.entities.length; i++) {
            var entity = Map.entities[i];

            if (!entity.isVulnerable) {
                // Probably a wall. Or a projectile. Or something.
                continue;
            }

            if (entity === this.firedBy) {
                // The entity that fired a projectile can never be harmed by itself.
                // For now at least.
                continue;
            }

            var boundingBox = entity.getRect();

            if (Utils.rectIntersects(ourBox, boundingBox)) {
                entity.hurt();

                Map.remove(this);
                return;
            }
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