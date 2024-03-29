class Ant {
    constructor() {
        this.x = pad;
        this.y = pad;
        this.blood = 1.0;
        this.path = [[pad, pad]];
        this.forward = true;
        this.gotFood = false;
        this.prevDirection = [0, 0]; // prevent the ant from stucking at directions No. 0 and No. 4
        console.log('ant created');
    }
    draw() {
        const wpx = width/res;
        const hpx = height/res;
        textSize(2*hpx);
        text('🐜', this.x*wpx-2*hpx/2, this.y*hpx+2*hpx/2);
        if (showBlood) {
            rect(this.x*wpx-5*wpx/2, this.y*hpx-2*hpx, 5*wpx, 1*hpx);
            if (this.blood > 0.6)
                fill(0, 220, 0);
            else if (this.blood > 0.3)
                fill(255, 165, 0);
            else
                fill(255, 0, 0);
            rect(this.x*wpx-5*wpx/2, this.y*hpx-2*hpx, this.blood*5*wpx, 1*hpx);
            fill(255, 255, 255);
        }
    }
    step() {
        // kill & revive
        if (this.blood <= 0) {
            this.x = pad;
            this.y = pad;
            this.blood = 1.0;
            this.path = [[pad, pad]];
            this.forward = true;
            this.gotFood = false;
            this.prevDirection = [0, 0]
        }

        let xLowerBound = pad;
        let xUpperBound = res-pad;
        let yLowerBound = pad;
        let yUpperBound = res-pad;
        /*
                   /  [1, -1] No. 0
                  /
                 /
                •------ [1, 0] No. 1
               /| \
              / |   \
             /  |     \[1, 1] No. 2
        [-1, 1] [0, 1]
         No. 4  No. 3

        remove matrix

        remove dir| bounding cases
        --------------------------------------
           [1, -1]| xUpperBound, yLowerBound
            [1, 0]| xUpperBound
            [1, 1]| xUpperBound, yUpperBound
            [0, 1]| yUpperBound
           [-1, 1]| xLowerBound, yUpperBound
        */
        /*############ bounding check ############*/
        let possible = [[1, -1], [1, 0], [1, 1], [0, 1], [-1, 1]];
        if ((this.x>=xUpperBound || this.y<=yLowerBound) || (this.prevDirection[0]==-1 && this.prevDirection[1]==1))
            possible.splice(possible.indexOf2d([1, -1]), 1);
        if (this.x>=xUpperBound)
            possible.splice(possible.indexOf2d([1, 0]), 1);
        if (this.x>=xUpperBound || this.y>=yUpperBound)
            possible.splice(possible.indexOf2d([1, 1]), 1);
        if (this.y>=yUpperBound)
            possible.splice(possible.indexOf2d([0, 1]), 1);
        if ((this.x<=xLowerBound || this.y>=yUpperBound) || (this.prevDirection[0]==1 && this.prevDirection[1]==-1))
            possible.splice(possible.indexOf2d([-1, 1]), 1);
        /*########################################*/

        /*############ choose next step ############*/
        let randSelector = Math.floor(Math.random() * Math.floor(possible.length)); // uniform probability
        let followOrNot = Math.floor(Math.random() * Math.floor(500)); // 1/500 follow the pheromone
        if (followOrNot) {
            let pheromones = [] // collect pheromone value on candidate path
            for (let i = 0; i < possible.length; i++) {
                let vertex = new Vertex (
                    this.x+possible[i][0]*step,
                    this.y+possible[i][1]*step
                );
                if (!world.vertices[world.vertices.indexOfVertex(vertex)].enable) { // the candidate vertex is blocked
                    possible.splice(i--, 1); // make the index point to the next element by "don't change the value"
                    continue;
                }
                let edge = new Edge(
                    this.x,
                    this.y,
                    this.x+possible[i][0]*step,
                    this.y+possible[i][1]*step
                );
                pheromones.push(world.edges[world.edges.indexOfEdge(edge)].pheromone);
            }
            let sum = 0;
            pheromones.forEach(item => {
                sum += item;
            });
            if (sum) { // check if at least one path have pheromone
                pheromones.forEach((item, i) => {
                    pheromones[i] /= sum; // normalize between 0-1
                });
                let odds = {};
                for (let i = 0; i < pheromones.length; i++)
                    odds[i] = pheromones[i];
                randSelector = weightedRandom(odds); // probability based on pheromone value
            }
        }
        if (randSelector==-1 || randSelector>=possible.length) { // no candidate i.e. dead lock
            this.forward = false;
            return;
        }
        let selected = possible[randSelector];
        let edge = new Edge(
            this.x,
            this.y,
            this.x+selected[0]*step,
            this.y+selected[1]*step
        );
        this.prevDirection = selected; // prevent the ant from stucking at directions No. 0 and No. 4
        this.x += selected[0]*step;
        this.y += selected[1]*step;

        // leave pheromone trace
        world.edges[world.edges.indexOfEdge(edge)].pheromoneBuf += 255/numAnts;
        this.blood -= bloodDecrement;


        let vertex = new Vertex (
            this.x,
            this.y
        );
        let foodIndex = world.verticesContents.indexOfVertex(vertex)
        if (world.verticesContents[foodIndex].content == 'Food') {
            this.forward = false;
            this.gotFood = true;
            world.verticesContents[foodIndex].foodAmount -= 0.0001*res;
            this.blood = 1.0;
            return;
        }

        // record the path
        this.path.push([this.x, this.y]);
    }
    stepBack() {
        let prev = this.path.pop();
        // leave pheromone trace
        let edge = new Edge(
            this.x,
            this.y,
            prev[0],
            prev[1]
        );
        if (this.gotFood)
            world.edges[world.edges.indexOfEdge(edge)].pheromoneBuf += 255/numAnts;

        // step back to the previous vertex
        this.x = prev[0];
        this.y = prev[1];
        if (this.x==pad && this.y==pad) {
            this.path = [[pad, pad]];
            this.forward = true;
            this.gotFood = false;
            this.blood = 1.0;
        }
    }
}
Array.prototype.indexOf2d = function(key) {
    for (let i = 0; i < this.length; i++) {
        if (this[i][0]==key[0] && this[i][1]==key[1])
            return i;
    }
    return -1;
};
Array.prototype.indexOfEdge = function(key) {
    for (let i = 0; i < this.length; i++) {
        if ((this[i].x1==key.x1 && this[i].y1==key.y1) && (this[i].x2==key.x2 && this[i].y2==key.y2))
            return i;
        if ((this[i].x1==key.x2 && this[i].y1==key.y2) && (this[i].x2==key.x1 && this[i].y2==key.y1))
            return i;
    }
    return -1;
}
Array.prototype.indexOfVertex = function(key) {
    for (let i = 0; i < this.length; i++) {
        if (this[i].x==key.x && this[i].y==key.y)
            return i;
    }
    return -1;
}
function weightedRandom(prob) {
    let i, sum=0, r=Math.random();
    for (i in prob) {
        sum += prob[i];
        if (r <= sum)
            return i;
    }
}
