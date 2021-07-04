import * as engine from "./engine.mjs";

let currentColour = 0;
let backgroundColour = 1;
let currentColourInput;
let mouseX = 0;
let mouseY = 0;

let sprite = {
    width: 50,
    height: 50,
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

let colourPicker = document.getElementById("colour-picker");
let bigCanvas = document.getElementById("big");
let smallCanvas = document.getElementById("small");
let heightInput = document.getElementById("height");
let widthInput = document.getElementById("width");
let spriteText = document.getElementById("sprite-text");
let colourInput = document.getElementById("colour-input");
let fillButton = document.getElementById("fill");

heightInput.value = sprite.height;
widthInput.value = sprite.width;

function buildColourPicker()
{
    let i = 0;
    colourPicker.innerHTML = sprite.palette.map(x => `<span class="colour" style="background-color: ${x}" onclick="window.handlers.onColourClick(this, ${i++});"></span>`).join("\n");
    currentColourInput = colourPicker.firstChild;
    colourInput.value = currentColourInput.style.backgroundColor;
}

buildColourPicker();

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
    bigContext = engine.renderer(bigCanvas, 20, sprite.width, sprite.height);
    smallContext = engine.renderer(smallCanvas, 5, sprite.width, sprite.height);
    bigImage = bigContext.createTexture(sprite);
    smallImage = smallContext.createTexture(sprite);
    redraw();
}

createContextsAndImages();

bigCanvas.addEventListener("mousemove", e => {
    let rect = bigCanvas.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;
    mouseX = Math.floor(x / 20);
    mouseY = Math.floor(y / 20);
    if (bigCanvas.active) {
        if (fill.checked) doFill()
        else drawPixel();
    }
});

function drawPixel(x, y) {
    x = x || mouseX;
    y = y || mouseY;
    sprite.pixels[y * sprite.width + x] = currentColour;
    bigImage.setPixel(x, y, currentColour);
    smallImage.setPixel(x, y, currentColour);
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
    if (fill.checked) doFill()
    else drawPixel();
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
    let newHeight = heightInput.valueAsNumber;
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
});

widthInput.addEventListener("change", e => {
    let newWidth = widthInput.valueAsNumber;
    let newArr = new Array(sprite.height*newWidth).fill(0);

    for (let x = 0; x < Math.min(sprite.width, newWidth); ++x) {
        for (let y = 0; y < sprite.height; ++y) {
            newArr[y * newWidth + x] = sprite.pixels[y * sprite.width + x];
        }
    }

    sprite.pixels = newArr;
    sprite.width = newWidth;

    createContextsAndImages();
});

spriteText.addEventListener("change", e => {
    sprite = JSON.parse(spriteText.value);
    widthInput.value = sprite.width;
    heightInput.value = sprite.height;
    buildColourPicker();
    createContextsAndImages();
});

colourInput.addEventListener("change", () => {
    sprite.palette[currentColour] = colourInput.value;
    currentColourInput.style.backgroundColor = colourInput.value;
    createContextsAndImages();
});

document.getElementById("Up").addEventListener("click", () => {
    sprite.pixels = sprite.pixels.slice(sprite.width).concat(new Array(sprite.width).fill(0));
    createContextsAndImages();
});

document.getElementById("Down").addEventListener("click", () => {
    sprite.pixels = new Array(sprite.width).fill(0).concat(sprite.pixels.slice(0, sprite.width * -1));
    createContextsAndImages();
});

document.getElementById("Left").addEventListener("click", () => {
    sprite.pixels = sprite.pixels.map((_, i) => ((i+1) % sprite.width) === 0 ? 0 : sprite.pixels[i+1]);
    createContextsAndImages();
});

document.getElementById("Right").addEventListener("click", () => {
    sprite.pixels = sprite.pixels.map((_, i) => (i % sprite.width) === 0 ? 0 : sprite.pixels[i-1]);
    createContextsAndImages();
});

function doFill() {
    let replaceColour = sprite.pixels[mouseY * sprite.width + mouseX];

    function fill(x, y) {
        if (sprite.pixels[y * sprite.width + x] == replaceColour) {
            drawPixel(x, y);
            if (x < sprite.width) fill(x+1, y);
            if (x > 0) fill(x-1, y);
            if (y < sprite.height) fill(x, y+1);
            if (y > 0) fill(x, y-1);
        }
    }

    fill(mouseX, mouseY);
    redraw();
}

window.handlers = { onColourClick: onColourClick };
redraw();
