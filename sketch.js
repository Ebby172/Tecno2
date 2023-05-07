let posx;
let posy;
let alto=50;
let ancho=50;
let anchoCanvas= 500;
let altoCanvas=500;
let anchoLinea= 300;
let distanciaConElCentro= (250-posx);


function setup() {
  posx=random(36, 164);
  posy=random(100,400);
    createCanvas(anchoCanvas, altoCanvas);
    background(100);
    imageMode( CENTER );
    fill(250,0,0);
    noStroke();
    rectMode(CENTER);
    rect(posx, posy, ancho,alto );
    stroke(0);
    strokeWeight(1);
    line(posx,posy-alto/2,posx+300,posy-(alto/2));
    strokeWeight(3);
    line(anchoCanvas/2,posy-alto/2,250+(250-posx),posy-(alto/2));
    
    
  }
  
  function draw() {

  }