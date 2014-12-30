var Player = Character.extend({
    position: { x: 25, y: 155},

    ammoInClip: 0,
    ammoClipSize: 0,
    reloadTime: 0,
    fireTimeout: 0,

    init: function() {
        this._super();
        this.txBody.src = 'assets/textures/steve.png';
        this.size = { w: 15, h: 20 };
        this.ammoClipSize = 15;
        this.ammoInClip = this.ammoClipSize;

        this.syncHud();
    },

    reload: function() {
        if (this.reloadTime > 0) {
            return;
        }

        this.reloadTime = 30;
        this.ammoInClip = this.ammoClipSize;

        Sfx.reload();

        this.syncHud();
    },

    syncHud: function() {
        var $ammoCount = $('#hud .ammo-count');
        $ammoCount.text(this.ammoInClip);

        if (this.reloadTime > 0) {
            $ammoCount.addClass('reloading');
        } else {
            $ammoCount.removeClass('reloading');
        }
    },

    fire: function() {
        var projectile = new Projectile(this);
        projectile.position = {
            x: this.position.x + (this.facingEast ? 5 : 15),
            y: this.position.y + (this.size.h / 2) - 3
        };
        projectile.velocity = {
            x: this.facingEast ? 10 : -10,
            y: 0
        };

        this.ammoInClip--;

        Map.add(projectile);
        Sfx.fire();

        this.syncHud();

        this.knockBack(1, this.facingEast);
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

        var reloading = false;

        if (this.reloadTime > 0) {
            // Reloading, one frame at a time
            this.reloadTime--;
            reloading = true;

            if (this.reloadTime == 0) {
                this.syncHud();
            }
        }

        if (this.fireTimeout > 0) {
            this.fireTimeout--;
        }

        if (!reloading && this.fireTimeout == 0 && this.canFire && Keyboard.isKeyDown(KeyEvent.DOM_VK_SPACE)) {
            if (this.ammoInClip <= 0) {
                this.reload();
            } else {
                this.fire();
                this.fireTimeout = 6;
            }
        }

        this._super();
    }

});