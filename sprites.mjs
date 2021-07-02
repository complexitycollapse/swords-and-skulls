function invert(sprite) {
    let inverted = { ...sprite };
    inverted.invertX = true;
    inverted.offsetX = inverted.width - inverted.offsetX;
    return inverted;
}

//export let player1 = {"width":"11","height":"14","offsetX":"5","offsetY":"7","palette":["rgba(0, 0, 0, 0)","red","black","red","green","blue","darkred","darkgreen","darkblue"],"pixels":[0,0,0,1,1,1,1,0,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0,1,1,1,1,1,1,0,0,0,1,0,1,1,1,1,1,1,0,0,0,1,0,0,1,1,1,1,0,0,0,0,0,1,1,1,1,1,1,1,0,0,0,0,0,0,1,1,1,1,1,1,1,0,0,0,0,1,1,1,1,0,0,1,1,0,0,0,1,1,1,1,0,0,0,0,0,0,0,1,0,0,1,1,0,0,0,0,0,0,1,0,0,1,1,1,0,0,0,0,1,1,0,0,0,1,1,0,0,0,1,1,1,0,0,0,1,1,0,0,0,0,0,0,0,0,0,1,1,1,0]};
//export let player2 = invert(player1);

export let playerTop = {"width":"11","height":"8","offsetX":"5","offsetY":"7","palette":["rgba(0, 0, 0, 0)","red","black","red","green","blue","darkred","darkgreen","darkblue"],"pixels":[0,0,0,1,1,1,1,0,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0,1,1,1,1,1,1,0,0,0,1,0,1,1,1,1,1,1,0,0,0,1,0,0,1,1,1,1,0,0,0,0,0,1,1,1,1,1,1,1,0,0,0,0,0,0,1,1,1,1,1,1,1,0,0,0,0,1,1,1,1,0,0,1,1]};
export let playerLegs1 = {"width":"11","height":"6","offsetX":"5","offsetY":"0","palette":["rgba(0, 0, 0, 0)","red","black","red","green","blue","darkred","darkgreen","darkblue"],"pixels":[0,0,0,1,1,1,1,0,0,0,0,0,0,0,1,0,0,1,1,0,0,0,0,0,0,1,0,0,1,1,0,0,0,0,0,1,1,0,0,0,1,0,0,0,0,1,1,1,0,0,0,1,1,0,0,0,0,0,0,0,0,0,1,1,1,0]};
export let playerLegs2 = invert(playerLegs1);
