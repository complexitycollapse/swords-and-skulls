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

        var obj = {
            ctx: ctx,
            width: width,
            height: height,
            pixelSize: pixelSize
        };

        obj.drawLayer = function (imageData, x, y) {
            ctx.putImageData(imageData, x, y);
        };

        return obj;
    };

    class Texture {
        constructor(pixelSize, width, height) {
            this.width = width;
            this.height = height;
            this.pixels = new Array(width * height);
            this.pixels.fill(0);
            this.pixelSize = pixelSize;
        }

        toIndex(x, y) {
            return y * this.width + x;
        }

        setPixel(x, y, c) {
            this.pixels[this.toIndex(x, y)] = c;
        }

        drawPixels(ctx) {
            var x;
            var y;
            const pS = this.pixelSize;

            for (x = 0; x < this.width; x++) {
                for (y = 0; y < this.height; y++) {
                    let colour = this.pixels[this.toIndex(x, y)];
                    if (colour !== 0)
                    {
                        ctx.fillStyle = "rgb(255, 0, 0, 255)";
                        ctx.fillRect(x * pS, y * pS, pS, pS);
                    }
                }
            }
        };

        buildImageData() {
            var canvas = document.createElement("canvas");
            canvas.height = this.height * this.pixelSize;
            canvas.width = this.width * this.pixelSize;
            var ctx = canvas.getContext("2d");
            this.drawPixels(ctx);
            return ctx.getImageData(0, 0, canvas.width, canvas.height);
        }
    }

    // The actual game goes in here
    var gameLogic = function (canvas, renderCtx) {
        var hero = {
            speed: 256,
            x: 256,
            y: 240
        };
        var monster = {};
        var oldMain = oldGame(canvas, hero, monster);

        var tex = new Texture(5, 50, 50);
        var x;
        var y;
        for (x = 0; x < 50; ++x) {
            for (y = 0; y < 50; ++y) {
                let i = y % 2;
                if ((x + i) % 2 === 0) {
                    tex.setPixel(x, y, "rgb(255, 0, 0, 255)");
                }
            }
        }
        var id = tex.buildImageData();

        return function (delta, mouseEvents) {
            oldMain(delta, renderCtx.ctx, mouseEvents, hero, monster);
            renderCtx.drawLayer(id, 10, 10);
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
