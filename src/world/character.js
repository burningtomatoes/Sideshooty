window.idgen = 0;
var Character = Class.extend({
    position: { x: 25, y: 155},
    id: (window.idgen++),
    movementSpeed: 1,
    jumpSpeed: 10,
    canJump: true,
    canFire: true,
    facingEast: true,
    velocity: { x: 0, y: 0 },
    size: { w: 15, h: 20 },
    txBody: new Image(),
    isVulnerable: true,

    init: function() {
        this.movementSpeed = 1;
        this.jumpSpeed = 10;
        this.canJump = true;
        this.canFire = true;
        this.facingEast = true;
        this.velocity = { x: 0, y: 0 };
        this.size = { w: 15, h: 20 };
        this.isVulnerable = true;

        this.txBody = new Image();
        this.txBody.src = 'assets/textures/enemy.png';
    },

    draw: function(ctx) {
        ctx.save();

        if (!this.facingEast) {
            ctx.translate(this.position.x + 16, this.position.y);
            ctx.scale(-1, 1);
        } else {
            ctx.translate(this.position.x, this.position.y);
        }

        ctx.drawImage(this.txBody, 0, 0, this.size.w, this.size.h, 0, 0, this.size.w, this.size.h);
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

        Map.remove(this);
    },

    update: function() {
        /*** Movement processing **/
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
        this.velocity.y += Map.gravity;

        /*** Collision detection **/
        var bounds = this.getRect();

        if (bounds.bottom > Renderer.canvas.height) {
            this.velocity.y = 0;
            this.position.y = Renderer.canvas.height - bounds.height;
            this.canJump = true; // restore jumping powers if we have landed safely
        }
    },

    getRect: function() {
        return {
            top: this.position.y,
            left: this.position.x,
            height: this.size.h,
            width: this.size.w,
            bottom: this.position.y + this.size.h,
            right: this.position.x + this.size.w
        };
    }
});