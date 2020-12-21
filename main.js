const pad = 5;
const step = 5;
const res = 100;
const numAnts = 100;
const fps = 60;

const decayRate = 0.8;
showVertice = false;
const vertexRadius = 20;

let world = new World();
ants = [];
for (var i = 0; i < numAnts; i++) {
    ants.push(new Ant());
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    frameRate(fps);
    showVerticeButton = createButton('Vertice on/off');
    showVerticeButton.mouseClicked(() => {showVertice = !showVertice;});
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

function mousePressed() {
    const wpx = width/res;
    const hpx = height/res;
    world.vertice.forEach((item, i) => {
        if ((Math.abs(item.x*wpx-mouseX)<vertexRadius) && (Math.abs(item.y*hpx-mouseY)<vertexRadius))
            item.enable = !item.enable;
    });
}
