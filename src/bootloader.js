$(document).ready(function() {
    Keyboard.bind();

    if (isCanvasSupported()) {
        Renderer.start();
    } else {
        $('#ohno').show();
    }
});

function isCanvasSupported(){
    var elem = document.createElement('canvas');
    return !!(elem.getContext && elem.getContext('2d'));
}