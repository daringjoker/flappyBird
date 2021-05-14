class Bird{
    constructor(){
        this.x=100;
        this.y=GAME_HEIGHT/2;
        this.velocity=0;
        this.sprite=BirdSprite;
        this.spriteX=0;
        this.spriteY=0;
        this.spriteWidth=this.sprite.width/5;
        this.spriteHeight=this.sprite.height/3;
        this.stepCount=0;
        this.spriteDelay=2;
        this.dead=false;
        this.deadFall=false;
        this.fallDelayCount=0;
        this.angle=0;

        this.fallSound=new Audio();
        this.fallSound.src="assets/fall.mp3";
    }


    update(){
        this.velocity-=Gravity;
        this.y-=this.velocity
        if(this.velocity< -10){
            this.angle=scale(-this.velocity,10,20,0,Math.PI/2);
            if(this.angle>Math.PI/2)this.angle=Math.PI/2;
        }
        if(this.dead&&!this.deadFall){
            this.y+=this.velocity;
            this.velocity=0;
            this.fallDelayCount++;
            if(this.fallDelayCount>30){
                this.deadFall=true;
                this.fallSound.play();
                this.fallSound.volume=0.02;
            }
        }
        if(!this.dead&&this.y>GAME_HEIGHT-Floor_Height){
            this.y=GAME_HEIGHT-Floor_Height;
        }
        if(this.y<0){
            this.y=0;
            this.velocity=0;
        }
        if(!this.dead){
            this.stepCount++;
            if(this.stepCount%this.spriteDelay==0){
                this.spriteX+=this.spriteWidth;
                if(this.spriteX>=this.sprite.width)
                {
                    this.spriteX=0;
                    this.spriteY=(this.spriteY+this.spriteHeight);
                }
                if(this.spriteY/this.spriteHeight===2&&this.spriteX/this.spriteWidth===4)
                    {
                        this.spriteY=0;
                        this.spriteX=0;
                    }
            }
        }
    }

    torect(){
        //returns the hitbox of the player
        //hitbox is smaller than the sprite of the character in order to make it easier to 
        //and fun to play.
        return{
            x:this.x-15,
            y:this.y-12,
            width:38,
            height:40
           }
    }
    collision(pillar){
        return(collideRects(pillar.upperRect(),this.torect())||collideRects(pillar.lowerRect(),this.torect()))
    }

    jump(){
        if(!this.dead)
        {
            this.velocity=10;
            this.angle=0;
        }

    }
}
