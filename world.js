class World {
    constructor() {
        console.log('world created');
        this.edges = [];
        this.edgesBuf = [];
        this.vertice = [];
        this.foods = [];

        for (let i = 0+pad; i <= res-pad-step; i+=step) {
            for (let j = 0+pad; j <= res-pad-step; j+=step) {
                this.edges.push(new Edge(i, j, (i+step), j));
                this.edges.push(new Edge(i, j, i, (j+step)));
                this.edges.push(new Edge(i, j, (i+step), (j+step)));
                this.edges.push(new Edge((i+step), j, i, (j+step)));

                this.edgesBuf.push(new Edge(i, j, (i+step), j));
                this.edgesBuf.push(new Edge(i, j, i, (j+step)));
                this.edgesBuf.push(new Edge(i, j, (i+step), (j+step)));
                this.edgesBuf.push(new Edge((i+step), j, i, (j+step)));
            }
        }
        for (let k = 0+pad; k <= res-pad-step; k+=step) {
            this.edges.push(new Edge(k, (res-pad), (k+step), (res-pad)));
            this.edges.push(new Edge((res-pad), k, (res-pad), (k+step)));

            this.edgesBuf.push(new Edge(k, (res-pad), (k+step), (res-pad)));
            this.edgesBuf.push(new Edge((res-pad), k, (res-pad), (k+step)));
        }
        for (let i = 0+pad; i <= res-pad; i+=step) {
            for (let j = 0+pad; j <= res-pad; j+=step)
                this.vertice.push(new Vertex(i, j, vertexRadius));
        }
        this.foods.push(new Food(res-pad, res-pad));
    }
    draw() {
        this.edges.deepCopyFrom(this.edgesBuf);
        this.edges.forEach(edge => {
            edge.draw();
            edge.pheromone *= decayRate;
        });
        this.edgesBuf.deepCopyFrom(this.edges);
        if (showVertice) {
            this.vertice.forEach(vertex => {
                vertex.draw();
            });
        }
        for (let i = 0; i < this.foods.length; i++) {
            if (this.foods[i].amount <= 0) {
                console.log('food was eaten');
                this.foods.splice(i, 1);
                i--;
            } else
                this.foods[i].draw();
        }
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
        if (!this.enable) {
            textSize(4*hpx);
            text('🚧', this.x*wpx-4*hpx/2, this.y*hpx+4*hpx/2);
        } else
            circle(this.x*wpx, this.y*hpx, this.r);
    }
}
class Edge {
    constructor(x1, y1, x2, y2) {
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
        this.pheromone = 0;
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
class Food {
    constructor(x, y) {
        console.log('food created', x, y);
        this.x = x;
        this.y = y;
        this.amount = 10;
    }
    draw() {
        const wpx = width/res;
        const hpx = height/res;
        textSize(this.amount*hpx);
        text('🍔', this.x*wpx-this.amount/2*hpx, this.y*hpx+this.amount/2*hpx);
    }
}
Array.prototype.deepCopyFrom = function(edges) {
     edges.forEach((item, i) => {
         this[i].pheromone = item.pheromone;
     });
}
