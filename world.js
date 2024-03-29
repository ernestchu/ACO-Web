class World {
    constructor() {
        console.log('world created');
        this.edges = [];
        this.vertices = [];
        this.verticesContents = [];

        for (let i = 0+pad; i <= res-pad-step; i+=step) {
            for (let j = 0+pad; j <= res-pad-step; j+=step) {
                this.edges.push(new Edge(i, j, (i+step), j));
                this.edges.push(new Edge(i, j, i, (j+step)));
                this.edges.push(new Edge(i, j, (i+step), (j+step)));
                this.edges.push(new Edge((i+step), j, i, (j+step)));
            }
        }
        for (let k = 0+pad; k <= res-pad-step; k+=step) {
            this.edges.push(new Edge(k, (res-pad), (k+step), (res-pad)));
            this.edges.push(new Edge((res-pad), k, (res-pad), (k+step)));
        }
        for (let i = 0+pad; i <= res-pad; i+=step) {
            for (let j = 0+pad; j <= res-pad; j+=step)
                this.vertices.push(new Vertex(i, j, vertexRadius));
        }
        for (let i = 0+pad; i <= res-pad; i+=step) {
            for (let j = 0+pad; j <= res-pad; j+=step)
                this.verticesContents.push(new VertexContents(i, j));
        }
    }
    draw() {
        this.edges.forEach(edge => {
            edge.pheromone = edge.pheromoneBuf;
            edge.draw();
            edge.pheromone *= decayRate;
            edge.pheromoneBuf = edge.pheromone;
        });
        if (showVertices) {
            this.vertices.forEach(vertex => {
                vertex.draw();
            });
        }
        this.verticesContents.forEach(content => {
            content.draw();
        });
    }
}
class Vertex {
    constructor(x, y, r) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.enable = true;
    }
    draw() {
        const wpx = width/res;
        const hpx = height/res;
        strokeWeight(1);
        if (this.enable)
            circle(this.x*wpx, this.y*hpx, this.r);
    }
}
class VertexContents {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.content = 'Standard';
        this.foodAmount = 10;
    }
    draw() {
        const wpx = width/res;
        const hpx = height/res;
        strokeWeight(1);
        if (this.content == 'Obstacle') {
            textSize(4*hpx);
            text('🚧', this.x*wpx-4*hpx/2, this.y*hpx+4*hpx/2);
        } else if (this.content == 'Food') {
            if (this.foodAmount <= 0) {
                console.log('food was eaten');
                this.content = 'Standard';
            } else {
                textSize(this.foodAmount*hpx);
                text('🍔', this.x*wpx-4*hpx/2, this.y*hpx+4*hpx/2);
            }
        }
    }
}
class Edge {
    constructor(x1, y1, x2, y2) {
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
        this.pheromone = 0;
        this.pheromoneBuf = 0;
    }
    draw() {
        const wpx = width/res;
        const hpx = height/res;
        strokeWeight(3);
        if (this.pheromone > 255)
            console.log('pheromone > 255 !');
        stroke(0, 0, 255, this.pheromone*2/Math.pow(decayRate, 3));
        line(this.x1*wpx, this.y1*hpx, this.x2*wpx, this.y2*hpx);
        stroke('black');
        if (this.pheromone < 1) // clipping for very low pheromone
            this.pheromone = 0;
    }
}
