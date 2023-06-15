let dibujado = false;
let opacidad = 0.2;
let lado = 150;
let margin = 50;
let rectangulo;
let linea;
let offsetX = 0;
let mouseMoving = false;
let coordAll = [];

let coordsFin;
function mouseMoved() {
    
    // Calcula el desplazamiento en la posición X
    let deltaX = mouseX - pmouseX;
    let maxOffsetX = 10;
    // Actualizar la variable offsetX con el desplazamiento limitado
    offsetX = constrain(offsetX + deltaX, -maxOffsetX, maxOffsetX);
   // Verificar si el mouse está en movimiento
   if (deltaX !== 0) {
    mouseMoving = true;
  } else {
    mouseMoving = false;
    offsetX = 0;
  }
    
  }

function setup(){
    let alto = windowWidth > 800 ? 800 : windowWidth*0.9 ;
    let ancho = alto ;
    
    createCanvas(ancho, alto);
    background("#eee");

    linea = new Linea();
    rectangulo = new Rectangulo();

    for(let i = 0; i < 3; i++){
        let color = generarColor();
        let coords = []; 
        let bold;
        let goingUp = false;

        if (i == 1) margin = height - 50;
        else goingUp =  true;

        // LINEAS
        for(let j = 0; j < 9; j++){
            let isLeft = random(2) < 1;
            bold = random(1, width/3); 
            let largo = width/2 + bold;
            
            coords[j] = {
                isLeft: isLeft,
                goingUp: goingUp,
                x: isLeft ? largo : width - largo,
                y: margin,
                bold
            }

            linea.dibujar(coords[j], bold)
            
            let d = random(1, Math.floor(height/9))
            if (goingUp) margin += d;
            else margin -= d;
        }
        
        //RECTANGULOS
        for(let j = 0; j < 9; j++){
            let moveLeft = random() < 0.5;
             if (moveLeft) {
                coords[j].x += offsetX;
    } else {
        coords[j].x += offsetX;
   }
            if(coords[j+1]) coordsFin = coords[j+1];
            else coordsFin = {
                isLeft: true,
                goingUp: goingUp,
                               
                bold,
                y: random(1,50), 
                x: random(1,50)
            };
              if (moveLeft) {
      coords[j].x -= offsetX;
    } else {
      coords[j].x += offsetX;
    }
            rectangulo.dibujar(coords[j], coordsFin, lado, color);
            coords[j].x += offsetX;
        }

        coordAll[i] = {
            color,
            coordsFin,
            coords,
        }
    }
}

function generarColor(){                                                    
    color = "rgba(";
    for(let i = 0; i < 3; i++){
        color += Math.floor((random(255))); 
        color += ", ";
    }
    return color += opacidad + ")";
}

function draw(){
    
    mouseMoved();
    background("#eee");
    for(let i = 0; i < 3; i++){
        let color = coordAll[i].color;
        let coords = []; 
        let goingUp = false;
        let bold;

        if (i != 1) goingUp = false;

        // LINEAS
        for(let j = 0; j < 9; j++){
            coordAll[i].coords[j].x += offsetX;
            let isLeft = coordAll[i].coords[j].isLeft;
            bold = coordAll[i].coords[j].bold;
            let largo;
            let d;

            // ANIMACION PETE
        //    if(mouseX > width/2){
        //        d = (mouseX - width/2);
        //        bold += d;
        //        //if(bold > width/2*.96) bold =  width/2*.96;    
        //    }else{
            //       d = (width/2 - mouseX);
            //bold -= d;
            //if(bold < .04) bold =  width/2*.96;
            
           // console.log(bold)
            //}
            
            //if(bold < 2) {
              //  isLeft = !isLeft;
           // }

            x: isLeft ? largo : width - largo,

            coords[j] = {
                isLeft,
                goingUp: coordAll[i].coords[j].goingUp,
                y: coordAll[i].coords[j].y,
                x: coordAll[i].coords[j].x, 
                bold,
            }

            linea.dibujar(coords[j], bold)
        }

        //RECTANGULOS
        for(let j = 0; j < 9; j++){
            if(j < 8) coordsFin = coords[j+1];
            else coordsFin = {
                isLeft: true,
                goingUp: goingUp,
                bold,
                x: coordsFin.x,
                y: coordsFin.y,
                  // Mover los rectángulos solo si el mouse está en movimiento
      if (mouseMoving) {
        coords[j].x += offsetX;
      }
            };
            rectangulo.dibujar(coords[j], coordsFin, lado, color);
        }
        
    }
}
