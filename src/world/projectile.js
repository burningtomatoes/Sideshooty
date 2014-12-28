var Projectile = function() {
    this.position = { x: 0, y: 0 };
    this.velocity = { x: 0, y: 0 };
    this.size = { w: 11, h: 7 };

    this.txBody = new Image();
    this.txBody.src = 'assets/textures/bullet.png';

    this.draw = function(ctx) {
        ctx.save();

        if (this.velocity.x < 0) {
            ctx.translate(this.position.x + this.size.w, this.position.y);
            ctx.scale(-1, 1);
        } else {
            ctx.translate(this.position.x, this.position.y);
        }

        ctx.drawImage(this.txBody, 0, 0, this.size.w, this.size.h, 0, 0, this.size.w / 2, this.size.h / 2);
        ctx.restore();
    };

    this.update = function() {
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    };

    this.getRect = function() {
        return {
            top: this.position.y,
            left: this.position.x,
            height: 20,
            width: 15,
            bottom: this.position.y + 20,
            right: this.position.x + 15
        };
    };
};