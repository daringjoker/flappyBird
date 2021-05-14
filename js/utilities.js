function scale(x, from_low,from_high, to_low, to_high)
{
    // this function scales a value x from the range (from_low,from_high) to the range (to_low , to_high)
    return to_low+((x-from_low)/(from_high-from_low))*(to_high-to_low)
}

function random(a,b){
    //returns a random decimal value between a and b inclusive;
    return a+Math.random()*(b-a);
}

function randomInt(a,b){
    //returns a random Integer value between a and b inclusive;
    return a+Math.round((b-a)*Math.random());
}

function collideRects(rect1,rect2){
    return (rect1.x < rect2.x + rect2.width &&
        rect1.x + rect1.width > rect2.x &&
        rect1.y < rect2.y + rect2.height &&
        rect1.y + rect1.height > rect2.y);
}