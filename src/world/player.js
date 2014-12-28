var Player = Character.extend({
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
            var projectile = new Projectile();
            projectile.position = {
                x: this.position.x + (this.facingEast ? 5 : 15),
                y: this.position.y
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