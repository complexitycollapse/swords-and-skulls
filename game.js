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

        obj.drawLayer = function (image, x, y) {
            ctx.drawImage(image, x, y);
        };

        // Create a texture that can be rendered to this context.
        obj.createTexture = function (width, height, palette, pixelsArg) {
            var tex = {};

            tex.setPixel = function (x, y, c) {
                pixels[x + width * y] = c;
                let colour = palette[c];
                ctx.fillStyle = colour;
                ctx.fillRect(x * pS, y * pS, pS, pS);
            }

            var pixels = pixelsArg || new Array(width * height).fill(0);

            var canvas = document.createElement("canvas");
            const pS = obj.pixelSize;
            canvas.height = height * pS;
            canvas.width = width *pS;

            var ctx = canvas.getContext("2d");
            var x;
            var y;

            for (x = 0; x < width; x++) {
                for (y = 0; y < height; y++) {
                    tex.setPixel(x, y, pixels[x + y * width]);
                }
            }

            tex.draw = function (x, y) {
                obj.drawLayer(canvas, x, y);
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
