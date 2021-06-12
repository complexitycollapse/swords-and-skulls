function gameFramework () {

    // The main loop of the game. Call to start.
    function gameLoop (mouseEvents, gameLogic) {
        var then;
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
        return innerLoop;
    };

    // Attach mouse event handlers
    function initMouseEvents () {
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
    function renderer (canvas, pixelSize, width, height) {
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
            var pixels = pixelsArg || new Array(width * height);
            var canvas = document.createElement("canvas");
            const pS = obj.pixelSize;
            canvas.height = height * pS;
            canvas.width = width *pS;
            var ctx = canvas.getContext("2d");


            tex.setPixel = function (x, y, c) {
                pixels[x + width * y] = c;
                let colour = palette[c];
                ctx.fillStyle = colour;
                ctx.fillRect(x * pS, y * pS, pS, pS);
            };

            tex.clear = function () {
                pixels.fill(0);
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            }

            tex.clear();

            var x;
            var y;

            for (x = 0; x < width; x++) {
                for (y = 0; y < height; y++) {
                    tex.setPixel(x, y, pixels[x + y * width]);
                }
            }

            tex.draw = function (x, y) {
                obj.drawLayer(canvas, x, y);
            };

            return tex;
        }

        obj.fill = function (c) {
            ctx.fillStyle = c;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        };

        return obj;
    };

    return { gameLoop: gameLoop, renderer: renderer, initMouseEvents: initMouseEvents };
};

function startGame ()
{
    // The actual game goes in here
    function gameLogic (renderCtx) {
        var hero = {
            speed: 256,
            x: 256,
            y: 240
        };
        var monster = {};

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
            tex.draw(10, 10);
        };
    };

    let framework = gameFramework();
    let canvas = document.getElementById("game");
    let mouseEvents = framework.initMouseEvents();
    let renderContext = framework.renderer(canvas, 5, 100, 100);
    let game = gameLogic(renderContext);
    return framework.gameLoop(mouseEvents, game);
}
