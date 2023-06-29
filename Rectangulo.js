class Rectangulo{

    constructor(){
    }

    dibujar(coordInicial, coordFinal, lado, color){
        push();
            noStroke();
            fill(color);
            angleMode(DEGREES);

            let catetoOpuesto = coordFinal.x - coordInicial.x;
            let hipotenusa = dist(coordInicial.x, coordInicial.y, coordFinal.x, coordFinal.y);

            let sina = catetoOpuesto/hipotenusa;              // relacion trigonometrica del seno 
            let a = degrees(Math.asin(sina));                 // el arcoseno de sin(a) = a 

            coordInicial.aumentaY ? a = -a : a += 180;       // correccion del angulo para que el rect no se dibuje mal 

            translate(coordInicial.x, coordInicial.y);
            rotate(a);
            translate(-lado/2, 0);
            rect(0, 0, lado, hipotenusa);                     //hipotenusa es a su vez el largo del rectangulo
        pop();
    }
}