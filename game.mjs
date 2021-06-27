import * as engine from "./engine.mjs";
import * as sprites from "./sprites.mjs";

function moveHero(hero, { mouseX, mouseY }, delta) {
    let dx = mouseX - hero.x;
    let dy = mouseY - hero.y;
    let move = hero.speed * delta;
    let h = Math.sqrt(dx*dx+dy*dy);
    if (h > 2)
    {
        let scale = move / h;
        if (!isNaN(scale))
        {
            hero.x += scale * dx;
            hero.y += scale * dy;
        }
    }
}

function clampMouse({ mouseX, mouseY }, minX, minY, maxX, maxY) {
    return  {
        mouseX: Math.min(Math.max(minX, mouseX), maxX),
        mouseY: Math.min(Math.max(minY, mouseY), maxY)
    };
}

function gameLogic (renderCtx) {
    let hero = {
        speed: 256,
        x: 50,
        y: 50,
        frames: [sprites.player1, sprites.player2].map(x => renderContext.createTexture(x))
    };
    let monster = {};

    return function (time, delta, mouseEvents) {
        renderCtx.fill("white");
        let spriteChoice = Math.round(time * 2) % 2;
        let clampedMouse = clampMouse(mouseEvents, 0, 0, canvas.width, canvas.height);
        moveHero(hero, clampedMouse, delta);
        hero.frames[spriteChoice].draw(hero.x, hero.y);
    };
};

let canvas = document.getElementById("game");
let mouseEvents = engine.initMouseEvents();
let renderContext = engine.renderer(canvas, 5, 100, 100);
let game = gameLogic(renderContext);
engine.gameLoop(mouseEvents, game);
