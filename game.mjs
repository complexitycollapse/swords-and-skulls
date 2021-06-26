import * as engine from "./engine.mjs";
import * as sprites from "./sprites.mjs";

function moveHero(hero, mouseEvents, delta) {
    let dx = mouseEvents.mouseX - hero.x;
    let dy = mouseEvents.mouseY - hero.y;
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

function gameLogic (renderCtx) {
    var hero = {
        speed: 256,
        x: 50,
        y: 50,
        frames: [sprites.player1, sprites.player2].map(x => renderContext.createTexture(x))
    };
    var monster = {};

    return function (time, delta, mouseEvents) {
        renderCtx.fill("white");
        let spriteChoice = Math.round(time * 2) % 2;
        moveHero(hero, mouseEvents, delta);
        hero.frames[spriteChoice].draw(hero.x, hero.y);
    };
};

let canvas = document.getElementById("game");
let mouseEvents = engine.initMouseEvents();
let renderContext = engine.renderer(canvas, 5, 100, 100);
let game = gameLogic(renderContext);
engine.gameLoop(mouseEvents, game);
