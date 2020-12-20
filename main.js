const pad = 5;
const step = 5;
const res = 100;
const numAnts = 10;
const fps = 10;

const decayRate = 0.9;
showVertice = false;

let world = new World();
ants = [];
for (var i = 0; i < numAnts; i++) {
    ants.push(new Ant());
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    frameRate(fps);
    showVerticeButton = createButton('Vertice on/off');
    showVerticeButton.mouseClicked(() => {
        showVertice = (showVertice)? false: true;
    });
}

function draw() {
    clear(); // I don't know if that is necessary
    background(240);
    showVerticeButton.position((0.87*res)*width/res, (0.05*res)*height/res);
    world.draw();
    ants.forEach(ant => {
        ant.draw();
        if (ant.forward)
            ant.step();
        else
            ant.stepBack();
    });
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}
