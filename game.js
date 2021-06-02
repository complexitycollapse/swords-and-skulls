(function () {
    var then;

    // The main loop of the game. Call to start.
    var gameLoop = function (canvas, mouseEvents) {
        var ctx = canvas.getContext("2d");

        var requestAnimationFrame = (function () {
            var w = window;
            return w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;
        }());

        function innerLoop() {
            var now = Date.now();
            var delta = (now - then) / 1000;
            oldMain(delta, ctx);

            then = now;
            requestAnimationFrame(innerLoop);
        }
        var oldMain = oldGame(canvas);
        then = Date.now();
        innerLoop();
    };

    // Attach mouse event handlers
    var initMouseEvents = function (canvas) {
        var mouseEvents = {
            mouseX: 0,
            mouseY: 0,
            mouseOver: false
        };

        canvas.addEventListener("mousemove", function (e) {
            var bounds = e.target.getBoundingClientRect();
            mouseEvents.mouseX = e.clientX - bounds.left;
            mouseEvents.mouseY = e.clientY - bounds.top;
        });

        canvas.addEventListener("mouseover", function () {
            mouseEvents.mouseOver = true;
        });

        canvas.addEventListener("mouseout", function () {
            mouseEvents.mouseOver = false;
        });

        return mouseEvents;
    };

    {
        var canvas = document.getElementById("game");
        let mouseEvents = initMouseEvents(canvas);
        gameLoop(canvas, mouseEvents);
    }
}());
