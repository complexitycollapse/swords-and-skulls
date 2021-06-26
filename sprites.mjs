function invert(sprite) {
    let inverted = { ...sprite };
    inverted.invertX = true;
    inverted.offsetX = inverted.width - inverted.offsetX;
    inverted.offsetY = inverted.height - inverted.offsetY;
    return inverted;
}

export let player1 = {"width":"11","height":"14","offsetX":"5","offsetY":"7","palette":["rgba(0, 0, 0, 0)","red","black","red","green","blue","darkred","darkgreen","darkblue"],"pixels":[0,0,0,1,1,1,1,0,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0,1,1,1,1,1,1,0,0,0,1,0,1,1,1,1,1,1,0,0,0,1,0,0,1,1,1,1,0,0,0,0,0,1,1,1,1,1,1,1,0,0,0,0,0,0,1,1,1,1,1,1,1,0,0,0,0,1,1,1,1,0,0,1,1,0,0,0,1,1,1,1,0,0,0,0,0,0,0,1,0,0,1,1,0,0,0,0,0,0,1,0,0,1,1,1,0,0,0,0,1,1,0,0,0,1,1,0,0,0,1,1,1,0,0,0,1,1,0,0,0,0,0,0,0,0,0,1,1,1,0]};
export let player2 = invert(player1);
