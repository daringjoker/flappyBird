class Pillar{
    constructor(lastX,lastGapY){
                this.x=lastX+randomInt(MinPillarDistance,MaxPillarDistance);
                this.gapHeight=randomInt(MinGapHeight,MaxGapHeight);
                this.granted=false;                
                this.gapY=lastGapY;
               
                let delta=randomInt(0,MaxGapDelta);
                if(this.gapY-delta<100)
                {
                    this.gapY+=delta;
                }
                else if(this.gapY+delta>(GAME_HEIGHT-100-MaxGapHeight))
                {
                    this.gapY-=delta;
                }
                else{
                    this.gapY+=Math.pow(-1,randomInt(1,2))*delta;
                }
                this.width=randomInt(100,120);
    }
    update()
    {
        this.x-=GameSpeed;
    }
    upperRect()
    {
        return({
            x:this.x,
            y:0,
            width:this.width,
            height:this.gapY
        })
    }
    lowerRect()
    {
        return({
            x:this.x,
            y:this.gapY+this.gapHeight,
            width:this.width,
            height:GAME_HEIGHT-(this.gapY+this.gapHeight)
        })
    }
}