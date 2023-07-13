//--- CONFIGURACION ---
let AMP_MIN = 0.1;
let AMP_MAX = 0.5;
let FREC_MIN = 200;
let FREC_MAX = 1000;

//--- ENTRADA DE AUDIO ---
let mic;
let audioContext;

//--- AMPLITUD ---
let amp;
let haySonido;
let antesHabiaSonido;

//--- FRECUENCIA ---
let pitch;
const pitchModel = 'https://cdn.jsdelivr.net/gh/ml5js/ml5-data-and-models/models/pitch-detection/crepe/';
let frecuenciaActual;
let frecuenciaMapeada = 0;

//--- GESTOR ---
let gestorAmp;
let gestorPitch;

//--- CONFIGURACION OBRA ---
let opacidad = 0.1;
let lado = 150;           // lado fijo del rectangulo
let margenY = 50          // margen fijo para que las lineas no se pasen
let rectangulo;
let linea;

let coordTotales = [];     // arreglo que guarda los datos de cada grupo de rectangulos
let coordFinal;            // almacena el punto final para el ultimo rectangulo

//--- TEACHABLE MACHINE ---
let classifier;
let label;
let confidence;
let soundModel = 'https://teachablemachine.withgoogle.com/models/qf2RglL6Q/';

let reinicio = false;     // variable de control para saber si ocurre la condición
let sumado = false;       // variable de control para saber si ya se sumó 150 a lado
let cambioColor = false;  // variable de control para saber si cambió el color

let opacidadAnimacion = 0;
let ajuste = amp * 10;

let lineaGruesa = 3;
let lineaFina = 1;
let medioBold1 = 400;
let medioBold2 = 400;

// Copia profunda del arreglo
let lineaBoldOriginal;

// Cargar modelo machine learning
function preload() {
    classifier = ml5.soundClassifier(soundModel + 'model.json');
}

function setup() {
    let alto = windowWidth > 800 ? 800 : windowWidth * 0.9;
    let ancho = alto;
    createCanvas(ancho, alto);
    background("#fff");

    classifier.classify(gotResult);

    audioContext = getAudioContext(); // inicia motor de audio
    mic = new p5.AudioIn();           // inicia el mic
    mic.start(startPitch);            // enciende el mic y tansmite el analisis de frecuencia (pitch) al mic

    userStartAudio(); // para forzar el inicio de audio en algunos navegadores

    gestorAmp = new GestorSenial(AMP_MIN, AMP_MAX);
    gestorPitch = new GestorSenial(FREC_MIN, FREC_MAX);

    antesHabiaSonido = false;

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

function draw() {
    background('#eee');

    let vol = mic.getLevel(); // amplitud del micrófono (señal cruda);
    gestorAmp.actualizar(vol);

    amp = gestorAmp.filtrada;
    haySonido = amp > AMP_MIN;
    
    frecuenciaMapeada = map(frecuenciaActual, 0, 2000, 0, 400);

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

            if (haySonido) {     // ANIMACIÓN
                if (lado > 5 && lineaFina >= 0 && lineaGruesa >= 1) {
                    lado = lado - amp;
                    lineaFina = lineaFina - amp / 161;
                }
            }

            if (!haySonido && antesHabiaSonido) { // evento: deja de haber sonido
                lado = 150;
                lineaFina = 1;
                medioBold1 = 400;
                medioBold2 = 400;
                lineaGruesa = 3;
                coordTotales[i].coords[j].lineaBold = lineaBoldOriginal[j];
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
        cambiarColores();
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

            // Cambiar las posiciones de las líneas 
            for (let i = 0; i < 3; i++) {
                let color = coordTotales[i].color;
                let coords = [];
                let lineaBold;
                let aumentaY = false;
                let margenY = 50;

                if (i == 1) margenY = height - 50;
                else aumentaY = true;

                // ------ LINEAS -----
                for (let j = 0; j < 9; j++) {
                    let empiezaIzq = random(2) < 1;
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

                    let distancia = random(1, Math.floor(height / 9));
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

        if (opacidadAnimacion < 1) {
            reinicio = false;
            sumado = false; // Restablecer la variable de control para la siguiente animación
            cambioColor = false;
        }
    }

    if (lineaFina <= 0.1) {
        lineaFina = 0;
    }
    
    antesHabiaSonido = haySonido;
}

function generarColor() {
    color = "rgba(";
    for (let i = 0; i < 3; i++) {
        color += Math.floor(random(255));
        color += ", ";
    }
    return color += opacidad + ")";
}

function cambiarColores() {
    if (!cambioColor) {
        for (let i = 0; i < 3; i++) {
            coordTotales[i].color = generarColor(); // Genera un nuevo color para cada grupo de rectángulos
        }
    }
    cambioColor = true;
}

// MACHINE LEARNING
function gotResult(error, results) {
    if (results[0].label === "Aplauso" && results[0].confidence >= 0.9) {
        reinicio = true;
    }
}

//---- FRECUENCIA ----
function startPitch() {
    pitch = ml5.pitchDetection(pitchModel, audioContext, mic.stream, modelLoaded);
}

function modelLoaded() {
    getPitch();
}

function getPitch() {
    pitch.getPitch(function (err, frequency) {
        if (frequency) {
            frecuenciaActual = frequency;
        }
        getPitch();
    })
}