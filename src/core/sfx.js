var Sfx = {
    sounds: { },

    preload: function() {
        Sfx.load('jump.wav');
        Sfx.load('shoot.wav');
    },

    load: function(soundId) {
        console.log('[SFX] Loading sound effect', soundId);

        Sfx.sounds[soundId] = new Audio('assets/sfx/' + soundId);
    },

    play: function(soundId) {
        if (typeof Sfx.sounds[soundId] == 'undefined') {
            Sfx.load(soundId);
        }

        Sfx.sounds[soundId].play();
    },

    jump: function() { return Sfx.play('jump.wav'); },
    fire: function() { return Sfx.play('shoot.wav'); }
};