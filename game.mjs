import * as engine from "./engine.mjs";
import * as sprites from "./sprites.mjs";

function clampMouse({ mouseX, mouseY }, minX, minY, maxX, maxY) {
    return  {
        mouseX: Math.min(Math.max(minX, mouseX), maxX),
        mouseY: Math.min(Math.max(minY, mouseY), maxY)
    };
}

function makeHero() {
    let hero = {
        speed: 256,
        x: 50,
        y: 50,
        frames: [sprites.playerLegs1, sprites.playerLegs2].map(x => renderContext.createTexture(x)),
        topHalf: [sprites.playerTop, sprites.playerStriking].map(x => renderContext.createTexture(x)),
        strikeTime: 0
    };

    hero.draw = function(time) {
        hero.topHalf[0].draw(hero.x, hero.y);
        let legSpriteChoice = Math.round(time * 2) % 2;
        hero.frames[legSpriteChoice].draw(hero.x, hero.y);
    }

    hero.moveHero = function ({ mouseX, mouseY }, delta) {
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

    return hero;
}

function gameLogic (renderCtx) {
    let hero = makeHero();
    let monster = {};

    return function (time, delta, mouseEvents) {
        renderCtx.fill("white");
        let clampedMouse = clampMouse(mouseEvents, 0, 0, canvas.width, canvas.height);
        hero.moveHero(clampedMouse, delta);
        hero.draw(time);
    };
};

let canvas = document.getElementById("game");
let mouseEvents = engine.initMouseEvents();
let renderContext = engine.renderer(canvas, 5, 100, 100);
let game = gameLogic(renderContext);
engine.gameLoop(mouseEvents, game);
