var Enemy = Character.extend({
    position: { x: 25, y: 155},

    stuckFrames: 0,

    init: function() {
        this._super();

        this.txBody.src = 'assets/textures/enemy.png';
        this.size = { w: 15, h: 20 };

        this.position = { x: 0, y: 0 };
        this.position.x = Math.round(Math.random() * 20) + 160 + Math.round(Math.random() * 160);
        this.position.y = Math.round(Math.random() * 20) + 160  + Math.round(Math.random() * 160);
        this.facingEast = !(Math.random() >= 0.25);
        this.jumpSpeed = 8;
    },

    die: function() {
        this._super();

        Sfx.play('death_groan.wav');
    },

    update: function() {
        if (this.dead) {
            this._super();
            return;
        }

        /*** Move from side to side until we can no more ***/
        if (this.facingEast && this.canMoveRight) {
            this.position.x += this.movementSpeed;
        } else if (!this.facingEast && this.canMoveLeft) {
            this.position.x -= this.movementSpeed;
        }

        if ((this.position.x <= 0 || !this.canMoveLeft) && !this.facingEast) {
            this.stuckFrames++;

            if (this.stuckFrames > 10) {
                this.facingEast = true;
                this.stuckFrames = 0;
            }
        }
        else if ((this.position.x >= (Map.width * 16) || !this.canMoveRight) && this.facingEast) {
            this.stuckFrames++;

            if (this.stuckFrames > 10) {
                this.facingEast = false;
                this.stuckFrames = 0;
            }
        }
        else {
            this.stuckFrames = 0;
        }

        /*** Randomly jump, sometimes ***/
        if (Math.random() >= 0.980 && this.canJump) {
            this.jump();
        }

        /*** Collision with player ***/
        var theirBox = Map.player.getRect();
        var ourBox = this.getRect();

        if (Utils.rectIntersects(theirBox, ourBox)) {
            // Is the player jumping on top of us?
            var marginOfError = Map.player.velocity.y;
            if (theirBox.bottom <= (ourBox.top + marginOfError)) {
                Camera.rumble(5, 2);
                this.hurt(Map.player, 33);
                Map.player.jump();
            } else {
                Map.player.hurt(this, 10);
            }
        }

        this._super();
    }
});