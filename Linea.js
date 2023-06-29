class Linea{

    constructor(){
    }

    dibujar(coord){
        push();
            if(coord.empiezaIzq) {
                strokeWeight(lineaFina);
                line(width*0.04, coord.y, coord.x, coord.y)
                strokeWeight(lineaGruesa);
                line(width/2 - coord.lineaBold, coord.y, medioBold1, coord.y);
            }
            else {
                strokeWeight(lineaFina);
                line(width*0.96, coord.y, coord.x, coord.y); 
                strokeWeight(lineaGruesa);
                line(medioBold2, coord.y, width/2 + coord.lineaBold, coord.y);
            }
        pop();
    }
}