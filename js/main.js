let canvas=document.getElementById("myCanvas");
let ctx=canvas.getContext("2d");
let requestedFrame=null;

let pillarSprite=new Image();
pillarSprite.src="assets/log.png";
let bgSprite=new Image();
bgSprite.src="assets/bg.jpg";
let hitSound=new Audio();
hitSound.src="assets/hit.mp3";
let bgSound=new Audio();
bgSound.src="assets/bgmusic.mp3";

let backgroundX=0;
let score=0;
let highScore=0;


let player=new Bird();
let pillars=[];
function initialize(){
    player=new Bird();
    pillars=[];
    score=0;
    highScore=parseInt(localStorage.getItem("highScore"))||0;
    let lastX=GAME_WIDTH*3/4;
    let lastGapY=GAME_HEIGHT/2;
    for(let i =0;i<5;i++)
    {
        pillars.push(new Pillar(lastX,lastGapY));
        let last=pillars[pillars.length-1];
        lastX=last.x;
        lastGapY=last.gapY;
    }
    cancelAnimationFrame(requestedFrame);
    requestedFrame=requestAnimationFrame(nextFrame);
    bgSound.play();
    bgSound.currentTime=5;
    bgSound.volume=0.02;
}

function resize(){
    GAME_HEIGHT=window.innerHeight;
    GAME_WIDTH=window.innerWidth;
    canvas.width=GAME_WIDTH;
    canvas.height=GAME_HEIGHT;
}

function update()
{
    if(!player.dead)
    {      
         player.update();
        backgroundX=(backgroundX+(GameSpeed*0.3))%bgSprite.width;
        pillars.forEach(pillar=>{
            pillar.update();
            if(pillar.x < -pillar.width){
                let last=pillars[pillars.length-1];
                pillars.shift()
                pillars.push(new Pillar(last.x,last.gapY));
            }
        });
        if(player.collision(pillars[0]))
        {
            hitSound.play();
            player.dead=true;
            if(score>highScore){
                localStorage.setItem("highScore",score.toString());
            }
        }
        if(!pillars[0].granted&&pillars[0].x+pillars[0].width<player.torect().x)
        {
            score++;
            pillars[0].granted=true;
        }
    }else{
        player.update();
        if(player.y>canvas.height+100){
            cancelAnimationFrame(requestedFrame);
            bgSound.pause();
            bgSound.currentTime=0;
            setTimeout(gameOver,200);
            setTimeout(()=>{
            player.fallSound.pause();
            player.fallsound.currentTime=0;},500);
        }
    }
   
}
let spritePadding=4;
function render()
{
    ctx.drawImage(bgSprite,backgroundX,0,canvas.width,bgSprite.height-100,0,0,canvas.width,canvas.height);
    if(bgSprite.width-backgroundX<canvas.width){
        ctx.drawImage(bgSprite,2,0,canvas.width-(bgSprite.width-backgroundX),bgSprite.height-100,Math.round(bgSprite.width-backgroundX),0,canvas.width-(bgSprite.width-backgroundX),canvas.height);
    }
    pillars.forEach(pillar=>{        
        // ctx.fillStyle="green";
        ctx.drawImage(pillarSprite,633,41+493-pillar.gapY-5,71,pillar.gapY,pillar.x-10,0,pillar.width+20,pillar.gapY);
        // ctx.fillRect(pillar.x,0,pillar.width,pillar.gapY);
        ctx.drawImage(pillarSprite,633,41,71,GAME_HEIGHT-(pillar.gapY+pillar.gapHeight)+10,pillar.x-10,pillar.gapY+pillar.gapHeight-10,pillar.width+20,GAME_HEIGHT-(pillar.gapY+pillar.gapHeight)+10);
        // ctx.fillRect(pillar.x,pillar.gapY+pillar.gapHeight,pillar.width,GAME_HEIGHT-(pillar.gapY+pillar.gapHeight));
    })
    ctx.save();
    ctx.translate(player.x,player.y);
    ctx.rotate(player.angle);
    ctx.translate(-player.x,-player.y);
    ctx.drawImage(player.sprite,player.spriteX+spritePadding,player.spriteY+spritePadding,player.spriteWidth-2*spritePadding,player.spriteHeight-2*spritePadding,
        player.x-40,player.y-40,80,80);
    ctx.restore();
    //write the score on the screen
    ctx.font="bold 80px monospace";
    ctx.fillStyle="orange";
    ctx.textAlign="center";
    ctx.fillText(score,canvas.width/2,100);
    ctx.lineWidth=3;
    ctx.strokeStyle="black";
    ctx.strokeText(score,canvas.width/2,100);
}

function nextFrame()
{
    requestedFrame=requestAnimationFrame(nextFrame);
    update();
    render();
}

ctx.drawText=function(text,x,y){
    ctx.fillText(text,x,y);
    ctx.strokeText(text,x,y);
}

function handleRestart(e){
    document.removeEventListener("keydown",handleRestart);
    initialize();
}

function splashScreen(){
    let character=new Bird();
    menuRender=function(){
        ctx.drawImage(bgSprite,0,0,canvas.width,bgSprite.height-100,0,0,canvas.width,canvas.height);
        ctx.drawImage(character.sprite,character.spriteX+spritePadding,character.spriteY+spritePadding,character.spriteWidth-2*spritePadding,character.spriteHeight-2*spritePadding,
            character.x-40,character.y-40,80,80);
        ctx.textAlign="center";
        ctx.font="100px gamefont";
        ctx.fillStyle="orange";
        ctx.fillText("flappy bird",canvas.width/2,canvas.height/2-100);
        ctx.font="50px gamefont";
        ctx.fillText("in the forest",canvas.width/2,canvas.height/2-50);
        ctx.font="30px gamefont";
        ctx.fillStyle="green";
        ctx.fillText("Press Any Key to start...",canvas.width/2,canvas.height/2+20);
        ctx.font="20px gamefont";
        ctx.fillStyle="#333";
        ctx.fillText("Click to jump & avoid the tree trunk!!",canvas.width/2,canvas.height/2+80);
    }
    menuUpdate=function(){
        character.update()
        character.y=canvas.height/2-200;
        character.x=canvas.width/2-300;
    }
    menuNextFrame=function(){
        menuUpdate();
        menuRender();
        requestedFrame=requestAnimationFrame(menuNextFrame);
    }
    document.addEventListener("keydown",handleRestart); 
    requestAnimationFrame(menuNextFrame);
}

function gameOver(){
    let y_off=canvas.height;
    let character=new Bird();
    menuRender=function(){
        ctx.drawImage(bgSprite,0,0,canvas.width,bgSprite.height-100,0,y_off,canvas.width,canvas.height);
        ctx.drawImage(character.sprite,character.spriteX+spritePadding,character.spriteY+spritePadding,character.spriteWidth-2*spritePadding,character.spriteHeight-2*spritePadding,
            character.x-40,y_off+character.y-40,80,80);
        ctx.textAlign="center";
        ctx.font="100px gamefont";
        ctx.fillStyle="orange";
        ctx.fillText("flappy bird",canvas.width/2,y_off+canvas.height/2-100);
        ctx.font="50px gamefont";
        ctx.fillText("in the forest",canvas.width/2,y_off+canvas.height/2-50);
        ctx.font="30px gamefont";
        ctx.fillStyle="black";
        ctx.fillText(`score ${score} | HIGH ${highScore}`,canvas.width/2,y_off+canvas.height/2+20);
        ctx.font="30px gamefont";
        ctx.fillStyle="green";
        ctx.fillText("Press Any Key to restart...",canvas.width/2,y_off+canvas.height/2+80);
        ctx.font="20px gamefont";
        ctx.fillStyle="#333";
        ctx.fillText("Click to jump & avoid the tree trunk!!",canvas.width/2,y_off+canvas.height/2+120);
        if(score>highScore){
            ctx.font="40px gamefont";
            ctx.fillStyle="red";
            ctx.fillText("CONGRATULATIONS!! New HIGH SCORE",canvas.width/2,y_off+canvas.height/2+170);
        }
    }
    menuUpdate=function(){
        character.update()
        character.y=canvas.height/2-200;
        character.x=canvas.width/2-300;
        if(y_off>0)
        {
            y_off-=30;
        }
        else if (y_off<0){
            y_off=0;
        }
    }
    menuNextFrame=function(){
        menuUpdate();
        menuRender();
        requestedFrame=requestAnimationFrame(menuNextFrame);
    }
    document.addEventListener("keydown",handleRestart); 
    requestAnimationFrame(menuNextFrame);
}

resize();
addEventListener("resize",resize);
canvas.addEventListener("click",e=>player.jump());

splashScreen();
