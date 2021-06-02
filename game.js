(function () {
    var then;

    // The main loop of the game. Call to start.
    var gameLoop = function (mouseEvents, gameLogic) {

        var requestAnimationFrame = (function () {
            var w = window;
            return w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;
        }());

        function innerLoop() {
            var now = Date.now();
            var delta = (now - then) / 1000;
            gameLogic(delta, mouseEvents);

            then = now;
            requestAnimationFrame(innerLoop);
        }
        then = Date.now();
        innerLoop();
    };

    // Attach mouse event handlers
    var initMouseEvents = function () {
        var mouseEvents = {
            mouseX: 0,
            mouseY: 0
        };

        window.addEventListener("mousemove", function (e) {
            var bounds = e.target.getBoundingClientRect();
            mouseEvents.mouseX = e.clientX - bounds.left;
            mouseEvents.mouseY = e.clientY - bounds.top;
        });

        return mouseEvents;
    };

    var renderer = function (canvas, width, height) {
        const pixelSize = 5;
        canvas.width = width * pixelSize;
        canvas.height = height * pixelSize;
        var ctx = canvas.getContext("2d");
        var pixels = new Array(width * height);
        pixels.fill(0);

        var i;
        for(i = 0; i < pixels.length; i += 2) {
            pixels[i] = 1;
        }

        var obj = {
            ctx: ctx,
            width: width,
            height: height
        };

        function pixel(c, x, y) {
            ctx.fillStyle = c;
            ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
        }

        function toIndex(x, y) {
            return y * width + x;
        }

        obj.drawPixels = function drawPixels() {
            var x;
            var y;

            for (x = 0; x < width; x++) {
                for (y = 0; y < height; y++) {
                    let colour = pixels[toIndex(x, y)];
                    if (colour !== 0)
                    {
                        pixel("rgb(255, 0, 0, 255)", x, y);
                    }
                }
            }
        };

        return obj;
    };

    // The actual game goes in here
    var gameLogic = function (canvas, renderCtx) {
        var hero = {
            speed: 256,
            x: 256,
            y: 240
        };
        var monster = {};
        var oldMain = oldGame(canvas, hero, monster);

        return function (delta, mouseEvents) {
            oldMain(delta, renderCtx.ctx, mouseEvents, hero, monster);
            renderCtx.drawPixels();
        };
    };

    {
        let canvas = document.getElementById("game");
        let mouseEvents = initMouseEvents();
        let renderContext = renderer(canvas, 100, 100);
        let game = gameLogic(canvas, renderContext);
        gameLoop(mouseEvents, game);
    }
}());
