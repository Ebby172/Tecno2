class Linea{

    constructor(){
    }

    dibujar(coord, bold){
        push();         
            if(coord.isLeft) line(width*0.04, coord.y, coord.x, coord.y)   
            else line(width*0.96, coord.y, coord.x, coord.y)
            
            strokeWeight(3);
            line(width/2 - bold, coord.y, width/2, coord.y)
        pop();
    }

}