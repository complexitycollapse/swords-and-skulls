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
        frames: [sprites.player].map(x => renderContext.createTexture(x))
    };
    var monster = {};

    // var tex = renderCtx.createTexture({ width: 50, height: 50, palette: ["rgba(0, 0, 0, 0)","red","blue","green","black"], invertX: true });
    // var x;
    // var y;
    // for (x = 0; x < 50; ++x) {
    //     for (y = 0; y < 50; ++y) {
    //         let i = y % 2;
    //         if ((x + i) % 2 === 0) {
    //             tex.setPixel(x, y, y >= 25 ? (x < 25 ? 3 : 4) : (x < 25 ? 1 : 2));
    //         }
    //     }
    // }

    return function (delta, mouseEvents) {
        renderCtx.fill("white");
        moveHero(hero, mouseEvents, delta);
        hero.frames[0].draw(hero.x, hero.y);
    };
};

let canvas = document.getElementById("game");
let mouseEvents = engine.initMouseEvents();
let renderContext = engine.renderer(canvas, 5, 100, 100);
let game = gameLogic(renderContext);
engine.gameLoop(mouseEvents, game);
