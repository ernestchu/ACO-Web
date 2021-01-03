const pad = 5;
const step = 5;
const res = 100;
const numAnts = 500;
const fps = 30;

const decayRate = 0.7;
const bloodDecrement = 0.03;
showVertice = false;
showBlood = false;
mouseFunction = 'Standard';
const vertexRadius = 20;
const disableZone = [res-pad-2*step, pad+6*step] // disable obstacles and foods

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
    addObstaclesButton = createButton('Add obstacles');
    addObstaclesButton.mouseClicked(() => {mouseFunction = 'Obstacle';});
    addFoodsButton = createButton('Add foods');
    addFoodsButton.mouseClicked(() => {mouseFunction = 'Food';});
    resetCursorButton = createButton('Reset cursor');
    resetCursorButton.mouseClicked(() => {mouseFunction = 'Standard';});
    showBloodButton = createButton('Blood on/off');
    showBloodButton.mouseClicked(() => {showBlood = !showBlood;});
    cleanPherButton = createButton('Clean pher');
    cleanPherButton.mouseClicked(() => {
        world.edges.forEach(edge => {
            edge.pheromone = edge.pheromoneBuf = 0;
        });
    });
}

function draw() {
    const wpx = width/res;
    const hpx = height/res;
    clear(); // I don't know if that is necessary
    background(255);
    showVerticeButton.position((0.87*res)*wpx, (0.05*res)*hpx);
    addObstaclesButton.position((0.87*res)*wpx, (0.1*res)*hpx);
    addFoodsButton.position((0.87*res)*wpx, (0.15*res)*hpx);
    resetCursorButton.position((0.87*res)*wpx, (0.2*res)*hpx);
    showBloodButton.position((0.87*res)*wpx, (0.25*res)*hpx);
    cleanPherButton.position((0.87*res)*wpx, (0.30*res)*hpx);
    world.draw();
    ants.forEach(ant => {
        ant.draw();
        if (ant.forward)
            ant.step();
        else
            ant.stepBack();
    });
    if (mouseFunction == 'Obstacle') {
        textSize(4*hpx);
        text('🚧', mouseX-4*hpx/2, mouseY+4*hpx/2);
    } else if (mouseFunction == 'Food') {
        textSize(4*hpx);
        text('🍔', mouseX-4*hpx/2, mouseY+4*hpx/2);
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

function mousePressed() {
    const wpx = width/res;
    const hpx = height/res;
    world.verticeContents.forEach((item, i) => {
        if ((Math.abs(item.x*wpx-mouseX)<vertexRadius) && (Math.abs(item.y*hpx-mouseY)<vertexRadius)) {
            if (item.x < disableZone[0] || item.y > disableZone[1]) {
                if (mouseFunction=='Obstacle') {
                    item.content = (item.content=='Obstacle')? 'Standard': mouseFunction;
                    world.vertice[i].enable = !world.vertice[i].enable
                } else
                    item.content = mouseFunction;
            }
        }
    });
}
