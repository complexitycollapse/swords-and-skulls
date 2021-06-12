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
    let image = new Array(height * width).fill(currentColour);
    
    let colourPicker = document.getElementById("colour-picker");
    let bigCanvas = document.getElementById("big");
    let smallCanvas = document.getElementById("small");
    {
        let i = 0;
        colourPicker.innerHTML = palette.map(x => `<span class="colour" style="background-color: ${x}" onclick="window.handlers.onColourClick(${i++});"></span>`).join("\n");
    }
    function onColourClick(colour) {
            currentColour = colour;
        };
    let bigContext = framework.renderer(bigCanvas, 20, height, width);
    let smallContext = framework.renderer(smallCanvas, 5, height, width);

    let bigImage = bigContext.createTexture(height, width, palette, image);
    let smallImage = smallContext.createTexture(height, width, palette, image);

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
        image[mouseY * width + mouseX] = currentColour;
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

    window.handlers = { onColourClick: onColourClick };
}