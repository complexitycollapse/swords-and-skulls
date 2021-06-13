function startEditor ()
{
    let height = 50;
    let width = 50;
    let framework = gameFramework();

    let palette = [
        "rgba(0, 0, 0, 0)",
        "rgba(255, 255, 255, 255)",
        "rgba(0, 0, 255, 255)",
        "rgba(0, 255, 0, 255)",
        "rgba(255, 0, 0, 255)",
        "rgba(200, 200, 200, 255)",
        "rgba(0, 0, 127, 255)",
        "rgba(0, 127, 0, 255)",
        "rgba(127, 0, 0, 255)"];
    
    let currentColour = 0;
    let backgroundColour = 1;
    let imagePixels = new Array(height * width).fill(currentColour);
    
    let colourPicker = document.getElementById("colour-picker");
    let bigCanvas = document.getElementById("big");
    let smallCanvas = document.getElementById("small");
    let heightInput = document.getElementById("height");
    let widthInput = document.getElementById("width");

    heightInput.value = height;
    widthInput.value = width;

    {
        let i = 0;
        colourPicker.innerHTML = palette.map(x => `<span class="colour" style="background-color: ${x}" onclick="window.handlers.onColourClick(${i++});"></span>`).join("\n");
    }

    function onColourClick(colour) {
            currentColour = colour;
        };

    let bigContext;
    let smallContext;
    let bigImage;
    let smallImage;

    function createContextsAndImages() {
        bigContext = framework.renderer(bigCanvas, 20, width, height);
        smallContext = framework.renderer(smallCanvas, 5, width, height);
        bigImage = bigContext.createTexture(width, height, palette, imagePixels);
        smallImage = smallContext.createTexture(width, height, palette, imagePixels);
    }

    createContextsAndImages();

    bigCanvas.addEventListener("mousemove", e => {
        var rect = bigCanvas.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;
        mouseX = Math.floor(x / 20);
        mouseY = Math.floor(y / 20);
        if (bigCanvas.active) {
            drawPixel();
        }
    });

    let mouseX = 0;
    let mouseY = 0;

    function drawPixel() {
        imagePixels[mouseY * width + mouseX] = currentColour;
        bigImage.setPixel(mouseX, mouseY, currentColour);
        smallImage.setPixel(mouseX, mouseY, currentColour);
        redraw();
    }

    function redraw() {
        bigContext.fill(palette[backgroundColour]);
        smallContext.fill(palette[backgroundColour]);
        bigImage.draw(0, 0);
        smallImage.draw(0, 0);
    }

    bigCanvas.addEventListener("mousedown", e => {
        bigCanvas.active = true;
        drawPixel();
      });
    bigCanvas.addEventListener("mouseup", e => {
        bigCanvas.active = false;
      });

    document.getElementById("setBackground").addEventListener("click", e => {
        backgroundColour = currentColour;
        redraw();
    });

    document.getElementById("clear").addEventListener("click", e => {
        bigImage.clear();
        smallImage.clear();
        redraw();
    });

    heightInput.addEventListener("change", e => {
        let newHeight = heightInput.value;
        let newArr = new Array(width*newHeight).fill(0);

        for (let x = 0; x < width; ++x) {
            for (let y = 0; y < Math.min(height, newHeight); ++y) {
                let coord = y*width + x;
                newArr[coord] = imagePixels[coord];
            }
        }

        imagePixels = newArr;
        height = newHeight;

        createContextsAndImages();
        redraw();
    });

    widthInput.addEventListener("change", e => {
        let newWidth = widthInput.value;
        let newArr = new Array(height*newWidth).fill(0);

        for (let x = 0; x < Math.min(width, newWidth); ++x) {
            for (let y = 0; y < height; ++y) {
                newArr[y*newWidth + x] = imagePixels[y*width + x];
            }
        }

        imagePixels = newArr;
        width = newWidth;

        createContextsAndImages();
        redraw();
    });

    window.handlers = { onColourClick: onColourClick };
}