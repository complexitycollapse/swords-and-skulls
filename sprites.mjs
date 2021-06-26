function invert(sprite) {
    let inverted = { ...sprite };
    inverted.invertX = true;
    return inverted;
}

export let player1 = {"height":"14","width":"11","palette":["rgba(0, 0, 0, 0)","red","black","red","green","blue","darkred","darkgreen","darkblue"],"pixels":[0,0,0,1,1,1,1,0,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0,1,1,1,1,1,1,0,0,0,1,0,1,1,1,1,1,1,0,0,0,1,0,0,1,1,1,1,0,0,0,0,0,1,1,1,1,1,1,1,0,0,0,0,0,0,1,1,1,1,1,1,1,0,0,0,0,1,1,1,1,0,0,1,1,0,0,0,1,1,1,1,0,0,0,0,0,0,0,1,0,0,1,1,0,0,0,0,0,0,1,0,0,1,1,1,0,0,0,0,1,1,0,0,0,1,1,0,0,0,1,1,1,0,0,0,1,1,0,0,0,0,0,0,0,0,0,1,1,1,0]};
export let player2 = invert(player1);