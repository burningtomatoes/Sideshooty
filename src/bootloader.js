$(document).ready(function() {
    if (!isCanvasSupported()) {
        console.error('Canvas support not detected, refusing to start');
        $('#ohno').show();
        return;
    }

    Keyboard.bind();
    Mouse.bind();

    Renderer.start();
    Sfx.preload();
    Renderer.loadMap('test', function(ok) {
        if (!ok) {
            alert('Map could not be loaded, sorry.');
        }
    });

    // Bg music
    var bgMusic = new Audio('assets/music/superpixelknightmegasquaredadventure.mp3');
    bgMusic.addEventListener('ended', function() {
        this.currentTime = 0;
        this.load();
        this.play();
    }, false);
    bgMusic.load();
    bgMusic.play();
});

function isCanvasSupported(){
    var elem = document.createElement('canvas');
    return !!(elem.getContext && elem.getContext('2d'));
}