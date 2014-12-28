var Player = function() {
    this.position = { x: 25, y: 155};
    this.movementSpeed = 1;
    this.jumpSpeed = 10;
    this.canJump = true;
    this.canFire = true;
    this.facingEast = true;
    this.velocity = { x: 0, y: 0 };
    this.txBody = new Image();
    this.txBody.src = 'assets/textures/steve.png';

    this.draw = function(ctx) {
        ctx.save();

        if (!this.facingEast) {
            ctx.translate(this.position.x + 16, this.position.y);
            ctx.scale(-1, 1);
        } else {
            ctx.translate(this.position.x, this.position.y);
        }

        ctx.drawImage(this.txBody, 0, 0, 15, 20, 0, 0, 15, 20);
        ctx.restore();
    };

    this.update = function() {
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