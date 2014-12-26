$(document).ready(function() {
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