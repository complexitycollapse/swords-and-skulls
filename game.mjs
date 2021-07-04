import * as engine from "./engine.mjs";
import * as sprites from "./sprites.mjs";

function coordinateClamper(minX, minY, maxX, maxY) {
    return (obj) => {
        obj.x = Math.min(Math.max(minX, obj.x), maxX);
        obj.y = Math.min(Math.max(minY, obj.y), maxY);
    };
}

function makeSword() {
    let upLeft = renderContext.createTexture(sprites.swordUpLeft);
    let upRight = renderContext.createTexture(sprites.swordUpRight);
    let left = renderContext.createTexture(sprites.swordLeft);
    let right = renderContext.createTexture(sprites.swordRight);
    return {
        draw: (x, y, striking, facingLeft) => {
            let sprite = striking
                ? (facingLeft ? left : right)
                : (facingLeft ? upLeft : upRight);
            sprite.draw(x, y);
        }
    };
}

function makeHero(clampCoordinates) {
    let hero = {
        speed: 256,
        x: 50,
        y: 50,
        frames: [sprites.playerLegs1, sprites.playerLegs2].map(x => renderContext.createTexture(x)),
        topHalfLeft: [sprites.playerTopLeft, sprites.playerStrikingLeft].map(x => renderContext.createTexture(x)),
        topHalfRight: [sprites.playerTopRight, sprites.playerStrikingRight].map(x => renderContext.createTexture(x)),
        strikeTime: 0,
        sword: makeSword(),
        facingLeft: true
    };

    hero.draw = function(time) {
        let striking = hero.striking(time);
        (hero.facingLeft ? hero.topHalfLeft : hero.topHalfRight)[striking ? 1 : 0].draw(hero.x, hero.y);
        let legSpriteChoice = Math.round(time * 2) % 2;
        hero.frames[legSpriteChoice].draw(hero.x, hero.y);
        hero.sword.draw(hero.x, hero.y, striking, hero.facingLeft);
    }

    hero.striking = (time) => {
        return time - hero.strikeTime < 0.5;
    };

    hero.handleMouseInput = function (mouseEvents, time, delta) {
        let clampedMouse = {x: mouseEvents.mouseX, y: mouseEvents.mouseY};
        clampCoordinates(clampedMouse);
        let mouseX = clampedMouse.x;
        let mouseY = clampedMouse.y;
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

        clampCoordinates(hero);

        if (Math.abs(dx) > 2) {
            hero.facingLeft = dx < 0;
        }

        if (mouseEvents.clicked) {
            if (!hero.striking(time)) {
                hero.strikeTime = time;
            }
        }
    }

    return hero;
}

function gameLogic (renderCtx, canvasClamper) {
    let hero = makeHero(canvasClamper);
    let monster = {};

    return function (time, delta, mouseEvents) {
        renderCtx.fill("white");
        hero.handleMouseInput(mouseEvents, time, delta);
        hero.draw(time);
    };
};

let canvas = document.getElementById("game");
let mouseEvents = engine.initMouseEvents(canvas);
let renderContext = engine.renderer(canvas, 5, 100, 100);
let canvasClamper = coordinateClamper(0, 0, canvas.width, canvas.height);
let game = gameLogic(renderContext, canvasClamper);
engine.gameLoop(mouseEvents, game);
