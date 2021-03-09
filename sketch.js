var PLAY = 1;
var END = 0;
var gameState = PLAY;


var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle
var score;

var gameOver,gameOverIm, restart, restartIm;

localStorage["HighestScore"] = 0;

function preload(){
  trex_running = loadAnimation("download.png","download (1).png");
  trex_collided = loadAnimation("download (2).png");
  
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("spike.png");
  
  restartIm = loadImage("restart.png");
  gameOverIm = loadImage("gameOver.png");
}

function setup() {
  createCanvas(600, 200);
  
  trex = createSprite(50,180,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  trex.scale = 0.5;
  
  ground = createSprite(200,180,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  
  
  invisibleGround = createSprite(200,190,400,10);
  invisibleGround.visible = false;
  
  cloudsGroup = new Group();
  obstaclesGroup = new Group();
  
  score = 0;
  
  gameOver = createSprite(300,50);
  gameOver.addImage(gameOverIm);
  gameOver.scale = 0.5;
  
  restart = createSprite(300,100);
  restart.addImage(restartIm);
  restart.scale = 0.5;
}

function draw() {
  background("blue");
  camera.position.x = 275
  camera.position.y = 100;
  text("Score: "+ score, 500,50);
  text("High Score: "+localStorage["HighestScore"],50,50
)
 if(gameState === PLAY){ 
  score = score + Math.round(getFrameRate()/60);
  ground.velocityX = -4;
  // trex will jump when "space" is pressed
  if(keyDown("space")&& trex.y >= 100) {
    trex.velocityY = -10;
  }
   
  //gravity
  trex.velocityY = trex.velocityY + 0.8
  //resetting the ground
  if (ground.x < 0){
    ground.x = ground.width/2;
  }
  spawnClouds();
  spawnObstacles();
   
   gameOver.visible = false;
   restart.visible = false;
   
    if(trex.isTouching(obstaclesGroup)||score === 5000){
      gameState = END;
 }
}

 
  
  if(gameState === END){
    ground.velocityX = 0;
    obstaclesGroup.setLifetimeEach(-1);
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setLifetimeEach(-1);
    cloudsGroup.setVelocityXEach(0);
    trex.changeAnimation("collided",trex_collided);
    trex.velocityY = 0;
    
    gameOver.visible = true;
    restart.visible = true;
    
    if(mousePressedOver(restart)){
      reset();
    }
    
  }
trex.collide(invisibleGround);
  
  drawSprites();
 }

function spawnClouds() {
  //write code here to spawn the clouds
  if (camera.position.x % 60 === 0) {
    var cloud = createSprite(600,120,40,10);
    cloud.y = Math.round(random(80,120));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 200;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
  
}

function spawnObstacles() {
  if(frameCount % 60 === 0) {
    var obstacle = createSprite(600,165,10,40);
    obstacle.velocityX = -4;
    obstacle.addImage(obstacle1)
    
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.1;
    obstacle.lifetime = 300;
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}

function reset(){
  gameOver.visible = false;
  restart.visible = false;
  gameState = PLAY;
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  trex.changeAnimation("running",trex_running);
  
  if(localStorage["HighestScore"]<score){
    localStorage["HighestScore"] = score;

  }
  console.log(localStorage["HighestScore"])
  score = 0;
}