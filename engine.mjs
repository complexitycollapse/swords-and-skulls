// The main loop of the game. Call to start.
export function gameLoop (mouseEvents, gameLogic) {
    var then;
    var requestAnimationFrame = (function () {
        var w = window;
        return w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;
    }());

    function innerLoop() {
        var now = Date.now();
        var delta = (now - then) / 1000;
        gameLogic(now / 1000, delta, mouseEvents);

        then = now;
        requestAnimationFrame(innerLoop);
    }
    then = Date.now();
    innerLoop();
    return innerLoop;
};

// Attach mouse event handlers
export function initMouseEvents () {
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
export function renderer (canvas, pixelSize, width, height) {
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
    obj.createTexture = function ({ width, height, offsetX, offsetY, palette, pixels, invertX }) {
        var tex = {};
        pixels = pixels || new Array(width * height).fill(0);
        var canvas = document.createElement("canvas");
        const pS = obj.pixelSize;
        canvas.height = height * pS;
        canvas.width = width *pS;
        var ctx = canvas.getContext("2d");
        let trueOffsetX = (offsetX ?? 0) * pixelSize;
        let trueOffsetY = (offsetY ?? 0) * pixelSize;

        if (invertX) {
            ctx.translate(width * pS, 0);
            ctx.scale(-1, 1);
        }

        tex.setPixel = function (x, y, c) {
            pixels[x + width * y] = c;
            let colour = palette[c];
            ctx.fillStyle = colour;
            ctx.clearRect(x * pS, y * pS, pS, pS);
            ctx.fillRect(x * pS, y * pS, pS, pS);
        };

        tex.clear = function () {
            pixels.fill(0);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }

        for (let x = 0; x < width; x++) {
            for (let y = 0; y < height; y++) {
                tex.setPixel(x, y, pixels[x + y * width]);
            }
        }

        tex.draw = function (x, y) {
            obj.drawLayer(canvas, x - trueOffsetX, y - trueOffsetY);
        };

        return tex;
    }

    obj.fill = function (c) {
        ctx.fillStyle = c;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    };

    return obj;
};
