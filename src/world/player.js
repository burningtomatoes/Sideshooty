var Player = function() {
    this.position = { x: 25, y: 155};

    this.movementSpeed = 1;
    this.jumpSpeed = 10;
    this.canJump = true;

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
        if (Keyboard.isKeyDown(KeyEvent.DOM_VK_LEFT)) {
            this.position.x -= this.movementSpeed;
            this.facingEast = false;
        }

        if (Keyboard.isKeyDown(KeyEvent.DOM_VK_RIGHT)) {
            this.position.x += this.movementSpeed;
            this.facingEast = true;
        }

        if (this.canJump && Keyboard.wasKeyPressed(32)) {
            this.velocity.y -= this.jumpSpeed;
            this.canJump = false;
        }

        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
        this.velocity.y += Map.gravity;

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