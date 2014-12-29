var Player = Character.extend({
    position: { x: 25, y: 155},

    init: function() {
        this._super();
        this.txBody.src = 'assets/textures/steve.png';
        this.size = { w: 15, h: 20 };
    },

    update: function() {
        /*** Input ***/
        if (Keyboard.isKeyDown(KeyEvent.DOM_VK_LEFT) || Keyboard.isKeyDown(KeyEvent.DOM_VK_A)) {
            this.position.x -= this.movementSpeed;
            this.facingEast = false;
        }

        if (Keyboard.isKeyDown(KeyEvent.DOM_VK_RIGHT) || Keyboard.isKeyDown(KeyEvent.DOM_VK_D)) {
            this.position.x += this.movementSpeed;
            this.facingEast = true;
        }

        if (this.canJump && (Keyboard.wasKeyPressed(KeyEvent.DOM_VK_UP) || Keyboard.wasKeyPressed(KeyEvent.DOM_VK_W))) {
            this.velocity.y -= this.jumpSpeed;
            this.canJump = false;

            Sfx.jump();
        }

        if (this.canFire && Keyboard.wasKeyPressed(KeyEvent.DOM_VK_SPACE)) {
            var projectile = new Projectile(this);
            projectile.position = {
                x: this.position.x + (this.facingEast ? 5 : 15),
                y: this.position.y + (this.size.h / 2) - 3
            };
            projectile.velocity = {
                x: this.facingEast ? 10 : -10,
                y: 0
            };
            Map.add(projectile);

            Sfx.fire();
        }

        this._super();
    }
});