import * as engine from "./engine.mjs";
import * as sprites from "./sprites.mjs";

function clampMouse({ mouseX, mouseY, clicked }, minX, minY, maxX, maxY) {
    return  {
        mouseX: Math.min(Math.max(minX, mouseX), maxX),
        mouseY: Math.min(Math.max(minY, mouseY), maxY),
        clicked: clicked
    };
}

function makeSword() {
    let up = renderContext.createTexture(sprites.swordUp);
    let left = renderContext.createTexture(sprites.swordLeft);
    return {
        draw: (x, y, striking) => { striking ? left.draw(x, y) : up.draw(x, y); }
    };
}

function makeHero() {
    let hero = {
        speed: 256,
        x: 50,
        y: 50,
        frames: [sprites.playerLegs1, sprites.playerLegs2].map(x => renderContext.createTexture(x)),
        topHalf: [sprites.playerTop, sprites.playerStriking].map(x => renderContext.createTexture(x)),
        strikeTime: 0,
        sword: makeSword()
    };

    hero.draw = function(time) {
        let striking = hero.striking(time);
        hero.topHalf[striking ? 1 : 0].draw(hero.x, hero.y);
        let legSpriteChoice = Math.round(time * 2) % 2;
        hero.frames[legSpriteChoice].draw(hero.x, hero.y);
        hero.sword.draw(hero.x, hero.y, striking);
    }

    hero.striking = (time) => {
        return time - hero.strikeTime < 0.5;
    };

    hero.handleMouseInput = function ({ mouseX, mouseY, clicked }, time, delta) {
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

        if (clicked) {
            if (!hero.striking(time)) {
                hero.strikeTime = time;
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
        hero.handleMouseInput(clampedMouse, time, delta);
        hero.draw(time);
    };
};

let canvas = document.getElementById("game");
let mouseEvents = engine.initMouseEvents(canvas);
let renderContext = engine.renderer(canvas, 5, 100, 100);
let game = gameLogic(renderContext);
engine.gameLoop(mouseEvents, game);
