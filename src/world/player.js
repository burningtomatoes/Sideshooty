var Player = Character.extend({
    position: null,
    ammoInClip: 0,
    ammoClipSize: 0,
    reloadTime: 0,
    fireTimeout: 0,
    hurtTimeout: 0,

    txBlaster: null,

    weaponBackfire: 0,
    isFiring: false,

    score: 0,

    init: function() {
        this._super();

        this.position = { x: 160, y: 160};
        this.score = 0;

        this.txBody.src = 'assets/textures/steve.png';

        this.txCorpse = new Image();
        this.txCorpse.src = 'assets/textures/steve_dead.png';
        this.txCorpseSize = { w: 15, h: 20 };

        this.txBlaster = new Image();
        this.txBlaster.src = 'assets/textures/steve_blaster.png';

        this.size = { w: 15, h: 20 };
        this.ammoClipSize = 15;
        this.ammoInClip = this.ammoClipSize;
        this.hurtTimeout = 0;
        this.isFiring = false;

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

    drawExtras: function(ctx) {
        if (this.isHurting) {
            return;
        }

        var offsetPos = {
            x: this.lastPosition.x - this.position.x,
            y: this.lastPosition.y - this.position.y
        };

        ctx.drawImage(this.txBlaster, 0, 0, this.size.w, this.size.h, offsetPos.x - this.weaponBackfire, offsetPos.y - this.weaponBackfire, this.size.w, this.size.h);
    },

    syncHud: function() {
        var $ammoCount = $('#hud .ammo-count');
        $ammoCount.text(this.ammoInClip);

        if (this.reloadTime > 0) {
            $ammoCount.addClass('reloading');
        } else {
            $ammoCount.removeClass('reloading');
        }

        var $healthCount = $('#hud .health-count');
        $healthCount.text(this.healthNow + '/' + this.healthMax);

        var $scoreCount = $('.score-count');
        $scoreCount.text(this.score);
    },

    doScore: function(amount, reason) {
        this.score += amount;
        this.syncHud();

        if (reason != null && reason.length > 0) {
            var $callout = $('<span />')
                .text(reason + ' +' + amount)
                .hide()
                .appendTo($('#score-callouts'))
                .fadeIn('fast', function() {
                    $(this).delay(2500).fadeOut('fast');
                });
        }
    },

    fire: function() {
        var projectile = new Projectile(this);
        projectile.position = {
            x: this.position.x + (this.facingEast ? 0 : 7),
            y: this.position.y + (this.size.h / 2) - 1
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

        this.weaponBackfire = this.facingEast ? 1 : -1;

        Camera.rumble(5, 2);

        this.isFiring = true;
    },

    hurt: function(source, damage) {
        if (this.hurtTimeout > 0) {
            damage = 0;
        }

        if (damage > 0) {
            this.hurtTimeout = 10;
            Camera.rumble(5, 3);
        }

        this._super(source, damage);

        this.syncHud();
    },

    die: function() {
        this._super();

        $('#ded').show();
    },

    update: function() {
        if (this.dead) {
            if (Keyboard.wasKeyPressed(KeyEvent.DOM_VK_SPACE)) {
                // Restart game
                Renderer.loadMap(Map.id);

            }

            this._super();
            return;
        }

        /*** Input ***/
        if ((Keyboard.isKeyDown(KeyEvent.DOM_VK_LEFT) || Keyboard.isKeyDown(KeyEvent.DOM_VK_A)) && this.canMoveLeft) {
            if (!this.isFiring) {
                this.facingEast = false;
            }
            this.position.x -= this.movementSpeed;
        }

        if ((Keyboard.isKeyDown(KeyEvent.DOM_VK_RIGHT) || Keyboard.isKeyDown(KeyEvent.DOM_VK_D)) && this.canMoveRight) {
            if (!this.isFiring) {
                this.facingEast = true;
            }
            this.position.x += this.movementSpeed;
        }

        if (this.canJump && (Keyboard.wasKeyPressed(KeyEvent.DOM_VK_UP) || Keyboard.wasKeyPressed(KeyEvent.DOM_VK_W))) {
            this.jump();
        }

        var reloading = false;

        if (this.weaponBackfire > 0) {
            this.weaponBackfire--;
        } else if (this.weaponBackfire < 0) {
            this.weaponBackfire++;
        }

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

        var holdingFireButton = Keyboard.isKeyDown(KeyEvent.DOM_VK_SPACE);

        if (!reloading && this.fireTimeout == 0 && this.canFire) {
            if (Keyboard.wasKeyPressed(KeyEvent.DOM_VK_R)) {
                if (this.ammoInClip < this.ammoClipSize) {
                    this.reload();
                }
            } else if (holdingFireButton) {
                if (this.ammoInClip <= 0) {
                    this.reload();
                } else {
                    this.fire();
                    this.fireTimeout = 6;
                }
            }
        }

        this.isFiring = !!holdingFireButton;

        if (this.hurtTimeout > 0) {
            this.hurtTimeout--;
        }

        this._super();
    }

});