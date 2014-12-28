var Character = Class.extend({
    position: { x: 25, y: 155},
    movementSpeed: 1,
    jumpSpeed: 10,
    canJump: true,
    canFire: true,
    facingEast: true,
    velocity: { x: 0, y: 0 },
    txBody: new Image(),

    init: function() {
        this.txBody.src = 'assets/textures/steve.png';
    },

    draw: function(ctx) {
        ctx.save();

        if (!this.facingEast) {
            ctx.translate(this.position.x + 16, this.position.y);
            ctx.scale(-1, 1);
        } else {
            ctx.translate(this.position.x, this.position.y);
        }

        ctx.drawImage(this.txBody, 0, 0, 15, 20, 0, 0, 15, 20);
        ctx.restore();
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
            height: 20,
            width: 15,
            bottom: this.position.y + 20,
            right: this.position.x + 15
        };
    }
});