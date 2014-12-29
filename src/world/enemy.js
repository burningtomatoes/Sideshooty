var Enemy = Character.extend({
    position: { x: 25, y: 155},

    init: function() {
        this._super();

        this.txBody.src = 'assets/textures/enemy.png';
        this.size = { w: 15, h: 20 };

        this.facingEast = Math.random() >= 0.25;

        this.position = { x: 0, y: 0 };
        this.position.x = Math.round(Math.random() * 10 * (20 + Math.random()));
        this.position.y = Math.round(Math.random() * 10 * (2 + Math.random()));
    },

    update: function() {
        console.log(this.id + 1);

        if (this.facingEast) {
            this.position.x += this.movementSpeed;
        } else {
            this.position.x -= this.movementSpeed;
        }

        if (this.position.x <= 0 && !this.facingEast) {
            this.facingEast = true;
        }

        if (this.position.x >= Renderer.canvas.width && this.facingEast) {
            this.facingEast = false;
        }

        this._super();
    }
});