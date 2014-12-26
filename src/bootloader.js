$(document).ready(function() {
    if (!isCanvasSupported()) {
        console.error('Canvas support not detected, refusing to start');
        $('#ohno').show();
        return;
    }

    Keyboard.bind();
    Mouse.bind();

    Renderer.start();
});

function isCanvasSupported(){
    var elem = document.createElement('canvas');
    return !!(elem.getContext && elem.getContext('2d'));
}