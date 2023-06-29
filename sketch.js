//-------CONFIGURACION----
let AMP_MIN = 0.01; // umbral mínimo de amplitud. Señal que supera al ruido de fondo

//-----ENTRADA DE AUDIO----
let mic;

//-----AMPLITUD----
let amp;
let haySonido = false;

let opacidad = 0.1;
let lado = 150;           // lado fijo del rectangulo
let margenY = 50          // margen fijo para que las lineas no se pasen
let rectangulo;
let linea;

let coordTotales = [];     // arreglo que guarda los datos de cada grupo de rectangulos
let coordFinal;            // almacena el punto final para el ultimo rectangulo

//---TEACHABLE MACHINE---
let classifier;
let label;
let confidence;
let soundModel = 'https://teachablemachine.withgoogle.com/models/TISKWFIe5/';

let reinicio = false; // Variable de control para saber si ocurre la condición
let sumado = false; // Variable de control para saber si ya se sumó 150 a lado

let opacidadAnimacion = 0;
let lineaGruesa = 3;
let lineaFina = 1;
let medioBold1 = 400;
let medioBold2 = 400;
let ajuste = amp * 10;

// Copia profunda del arreglo
let lineaBoldOriginal;

// Cargar modelo
function preload() {
    classifier = ml5.soundClassifier(soundModel + 'model.json');
}

function setup() {
    let alto = windowWidth > 800 ? 800 : windowWidth * 0.9;
    let ancho = alto;
    createCanvas(ancho, alto);
    background("#fff");

    classifier.classify(gotResult);
    mic = new p5.AudioIn();
    mic.start();

    userStartAudio(); // esto lo utilizo porque en algunos navigadores se cuelga el audio. Esto hace un reset del motor de audio (audio context)

    linea = new Linea();
    rectangulo = new Rectangulo();

    for (let i = 0; i < 3; i++) {
        let color = generarColor();
        let coords = [];                      // coordenadas y datos de las 9 lineas 
        let lineaBold;
        let aumentaY = false;

        if (i == 1) margenY = height - 50;
        else aumentaY = true;

        // ------ LINEAS ------
        for (let j = 0; j < 9; j++) {
            let empiezaIzq = random(2) < 1;      // es un condicional, hay un 50% de que se dibuje a la izq o a la der
            lineaBold = random(1, width / 3);
            let largo = width / 2 + lineaBold;

            coords[j] = {
                empiezaIzq: empiezaIzq,
                aumentaY: aumentaY,
                x: empiezaIzq ? largo : width - largo,
                y: margenY,
                lineaBold
            }

            linea.dibujar(coords[j]);

            let distancia = random(1, Math.floor(height / 9))      // para que las lineas se dibujen en distintas distancias
            if (aumentaY) margenY += distancia;
            else margenY -= distancia;
        }

        // ------ RECTANGULOS ------
        for (let j = 0; j < 9; j++) {
            if (coords[j + 1]) coordFinal = coords[j + 1]
            else coordFinal = {
                empiezaIzq: random(2) < 1,
                aumentaY: aumentaY,

                lineaBold,
                y: margenY + random(1, Math.floor(height / 9)),
                x: width / 2 + random(1, width / 3),
            }
            rectangulo.dibujar(coords[j], coordFinal, lado, color);
        }

        coordTotales[i] = {
            color,
            coordFinal,
            coords
        }

        // Guardar copia profunda del arreglo original
        lineaBoldOriginal = coordTotales[i].coords.map((coord) => coord.lineaBold);
    }
}

function generarColor() {
    color = "rgba(";
    for (let i = 0; i < 3; i++) {
        color += Math.floor((random(255)));
        color += ", ";
    }
    return color += opacidad + ")";
}

function draw() {
    amp = mic.getLevel();
    haySonido = amp > AMP_MIN;

    background('#eee');

    for (let i = 0; i < 3; i++) {
        let color = coordTotales[i].color;
        let coords = []; // coordenadas y datos de las 9 lineas 
        let lineaBold;
        let aumentaY = false;

        if (i != 1) aumentaY = false;

        // ------ LINEAS -----
        for (let j = 0; j < 9; j++) {
            let empiezaIzq = coordTotales[i].coords[j].empiezaIzq;
            lineaBold = coordTotales[i].coords[j].lineaBold;

            // ANIMACION 
            if (
                haySonido &&
                lado > 5 &&
                lineaFina >= 0 &&
                lineaGruesa >= 1
            ) {
                lado = lado - amp;
                lineaGruesa = lineaGruesa - amp / 82;
                lineaFina = lineaFina - amp / 161;
            }
            if (coordTotales[i].coords[j].empiezaIzq == true) {
                coordTotales[i].coords[j].lineaBold += amp * 50;
                medioBold1 += amp * 5;
            } else {
                coordTotales[i].coords[j].lineaBold += amp * 50;
                medioBold2 -= amp * 5;
            }

            coords[j] = {
                empiezaIzq: empiezaIzq,
                aumentaY: coordTotales[i].coords[j].aumentaY,
                x: coordTotales[i].coords[j].x,
                y: coordTotales[i].coords[j].y,
                lineaBold
            }

            linea.dibujar(coords[j]);
        }

        // ------ RECTANGULOS ------
        for (let j = 0; j < 9; j++) {
            if (coords[j + 1]) coordFinal = coords[j + 1]
            else coordFinal = {
                empiezaIzq: random(2) < 1,
                aumentaY: aumentaY,

                lineaBold,
                y: coordFinal.x,
                x: coordFinal.y,
            }
            rectangulo.dibujar(coords[j], coordFinal, lado, color);
        }
    }

    fill(255, opacidadAnimacion);
    rect(0, 0, 800, 800);

    if (reinicio) {
        opacidadAnimacion -= 1;

        if (!sumado) {
            lado = 150; // Sumar 150 a lado solo una vez
            sumado = true; // Actualizar la variable de control para indicar que ya se sumó
            opacidadAnimacion = 255;
            lineaFina = 1;
            medioBold1 = 400;
            medioBold2 = 400;
            lineaGruesa = 3;

            // Restaurar el valor original de lineaBold en cada coordenada
            for (let i = 0; i < 3; i++) {
                coordTotales[i].coords.forEach(
                    (coord, index) => (coord.lineaBold = lineaBoldOriginal[index])
                );
            }
        }
        if (opacidadAnimacion < 1) {
            reinicio = false;
            sumado = false; // Restablecer la variable de control para la siguiente animación
        }
    }

    if (lineaFina <= 0.1) {
        lineaFina = 0;
    }
}

// The model recognizing a sound will trigger this event
function gotResult(error, results) {
    if (error) {
        console.error(error);
        return;
    }
    // The results are in an array ordered by confidence.
    if (results[0].label === "Aplauso" && results[0].confidence >= 0.99) {
        reinicio = true;
        console.log("lo hace");
    }
}