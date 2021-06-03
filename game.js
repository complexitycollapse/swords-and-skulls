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

    // Create a render context.
    var renderer = function (canvas, width, height) {
        const pixelSize = 5;
        canvas.width = width * pixelSize;
        canvas.height = height * pixelSize;
        var ctx = canvas.getContext("2d");

        var obj = {
            ctx: ctx,
            width: width,
            height: height,
            pixelSize: pixelSize
        };

        obj.drawLayer = function (imageData, x, y) {
            ctx.putImageData(imageData, x, y);
        };

        // Create a texture that can be rendered to this context.
        obj.createTexture = function (width, height, palette, pixelsArg) {
            var pixels = pixelsArg || new Array(width * height).fill(0);
            var imageData;

            var tex = {};

            tex.buildImageData = function () {
                const pS = obj.pixelSize;
                var canvas = document.createElement("canvas");
                canvas.height = height * pS;
                canvas.width = width *pS;
                var ctx = canvas.getContext("2d");
                var x;
                var y;

                for (x = 0; x < width; x++) {
                    for (y = 0; y < height; y++) {
                        let colour = palette[pixels[x + y * width]];
                        ctx.fillStyle = colour;
                        ctx.fillRect(x * pS, y * pS, pS, pS);
                    }
                }
                imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            }

            tex.setPixel = function (x, y, c) {
                pixels[x + width * y] = c;
            }

            tex.clearImageData = function () {
                imageData = undefined;
            }

            tex.draw = function (x, y) {
                if (imageData === undefined) {
                    tex.buildImageData();
                }
                obj.drawLayer(imageData, x, y);
            }

            return tex;
        }

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

        var tex = renderCtx.createTexture(50, 50, ["rgba(0, 0, 0, 0)","rgba(255, 0, 0, 255)"]);
        var x;
        var y;
        for (x = 0; x < 50; ++x) {
            for (y = 0; y < 50; ++y) {
                let i = y % 2;
                if ((x + i) % 2 === 0) {
                    tex.setPixel(x, y, 1);
                }
            }
        }

        tex.buildImageData();

        return function (delta, mouseEvents) {
            oldMain(delta, renderCtx.ctx, mouseEvents, hero, monster);
            tex.draw(10, 10);
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
