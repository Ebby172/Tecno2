class Rectangulo{

    constructor(){
    };

    dibujar(coordIni, coordFin, lado, color){
        push();
            noStroke();
            fill(color);
            angleMode(DEGREES);

            let catetoOpuesto = coordFin.x - coordIni.x;
            let hipotenusa = dist(coordIni.x, coordIni.y, coordFin.x, coordFin.y);

            let sina = catetoOpuesto/hipotenusa;  
            let a = degrees(Math.asin(sina));       

            coordIni.goingUp ? a = -a : a += 180;   //Correccion de angulos

            translate(coordIni.x, coordIni.y);
            rotate(a)
            translate(-lado/2, 0)
            rect(0, 0, lado, hipotenusa) //hipotenusa es a su vez el largo del rectangulo
        pop();
    }
}