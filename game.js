(function () {
    var canvas = document.getElementById("game");
    var requestAnimationFrame = (function () {
        var w = window;
        return w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;
    })();

    function gameLoop() {
        var now = Date.now();
        var delta = (now - then) / 1000;
        oldMain(delta);

        then = now;
        requestAnimationFrame(gameLoop);
    }
    var oldMain = oldGame(canvas);
    var then = Date.now();
    gameLoop();
})()
