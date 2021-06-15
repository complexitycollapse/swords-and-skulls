function startEditor ()
{
    let currentColour = 0;
    let backgroundColour = 1;
    let currentColourInput;

    let sprite = {
        height: 50,
        width: 50,
        palette: [
            "rgba(0, 0, 0, 0)",
            "white",
            "black",
            "red",
            "green",
            "blue",
            "darkred",
            "darkgreen",
            "darkblue"],
        pixels: new Array(50 * 50).fill(currentColour)
    };

    let framework = gameFramework();

    let colourPicker = document.getElementById("colour-picker");
    let bigCanvas = document.getElementById("big");
    let smallCanvas = document.getElementById("small");
    let heightInput = document.getElementById("height");
    let widthInput = document.getElementById("width");
    let spriteText = document.getElementById("sprite-text");
    let colourInput = document.getElementById("colour-input");

    heightInput.value = sprite.height;
    widthInput.value = sprite.width;

    {
        let i = 0;
        colourPicker.innerHTML = sprite.palette.map(x => `<span class="colour" style="background-color: ${x}" onclick="window.handlers.onColourClick(this, ${i++});"></span>`).join("\n");
        currentColourInput = colourPicker.firstChild;
        colourInput.value = currentColourInput.style.backgroundColor;
    }

    function onColourClick(input, colour) {
            currentColourInput = input;
            currentColour = colour;
            colourInput.value = currentColourInput.style.backgroundColor;
        };

    let bigContext;
    let smallContext;
    let bigImage;
    let smallImage;

    function createContextsAndImages() {
        bigContext = framework.renderer(bigCanvas, 20, sprite.width, sprite.height);
        smallContext = framework.renderer(smallCanvas, 5, sprite.width, sprite.height);
        bigImage = bigContext.createTexture(sprite);
        smallImage = smallContext.createTexture(sprite);
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
        sprite.pixels[mouseY * sprite.width + mouseX] = currentColour;
        bigImage.setPixel(mouseX, mouseY, currentColour);
        smallImage.setPixel(mouseX, mouseY, currentColour);
        redraw();
    }

    function redraw() {
        spriteText.value = JSON.stringify(sprite);
        bigContext.fill(sprite.palette[backgroundColour]);
        smallContext.fill(sprite.palette[backgroundColour]);
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
        let newArr = new Array(sprite.width*newHeight).fill(0);

        for (let x = 0; x < sprite.width; ++x) {
            for (let y = 0; y < Math.min(sprite.height, newHeight); ++y) {
                let coord = y * sprite.width + x;
                newArr[coord] = sprite.pixels[coord];
            }
        }

        sprite.pixels = newArr;
        sprite.height = newHeight;

        createContextsAndImages();
        redraw();
    });

    widthInput.addEventListener("change", e => {
        let newWidth = widthInput.value;
        let newArr = new Array(sprite.height*newWidth).fill(0);

        for (let x = 0; x < Math.min(sprite.width, newWidth); ++x) {
            for (let y = 0; y < sprite.height; ++y) {
                newArr[y * newWidth + x] = sprite.pixels[y * sprite.width + x];
            }
        }

        sprite.pixels = newArr;
        sprite.width = newWidth;

        createContextsAndImages();
        redraw();
    });

    spriteText.addEventListener("change", e => {
        sprite = JSON.parse(spriteText.value);
        widthInput.value = sprite.width;
        heightInput.value = sprite.height;
        createContextsAndImages();
        redraw();
    });

    colourInput.addEventListener("change", e => {
        sprite.palette[currentColour] = colourInput.value;
        currentColourInput.style.backgroundColor = colourInput.value;
        createContextsAndImages();
        redraw();
    });

    window.handlers = { onColourClick: onColourClick };
    redraw();
}