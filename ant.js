class Ant {
    constructor() {
        this.x = pad;
        this.y = pad;
        this.path = [[pad, pad]];
        this.forward = true;
        console.log('ant created');
    }
    draw() {
        const wpx = width/res;
        const hpx = height/res;
        strokeWeight(10);
        point(this.x*wpx, this.y*hpx);
    }
    step() {
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
        let possible = [[1, -1], [1, 0], [1, 1], [0, 1], [-1, 1]];
        if (this.x>=xUpperBound || this.y<=yLowerBound)
            possible.splice(possible.indexOf2d([1, -1]), 1);
        if (this.x>=xUpperBound)
            possible.splice(possible.indexOf2d([1, 0]), 1);
        if (this.x>=xUpperBound || this.y>=yUpperBound)
            possible.splice(possible.indexOf2d([1, 1]), 1);
        if (this.y>=yUpperBound)
            possible.splice(possible.indexOf2d([0, 1]), 1);
        if (this.x<=xLowerBound || this.y>=yUpperBound)
            possible.splice(possible.indexOf2d([-1, 1]), 1);

        let randSelector = Math.floor(Math.random() * Math.floor(possible.length));
        let selected = possible[randSelector];
        this.x += selected[0]*step;
        this.y += selected[1]*step;


        let edge = new Edge(
            this.path[this.path.length-1][0],
            this.path[this.path.length-1][1],
            this.x,
            this.y
        );
        world.edges[world.edges.indexOfEdge(edge)].pheromone = 255;

        if (this.x>=xUpperBound && this.y>=yUpperBound)
            this.forward = false;
        else
            this.path.push([this.x, this.y]);
    }
    stepBack() {
        let prev = this.path.pop();
        let edge = new Edge(
            this.x,
            this.y,
            prev[0],
            prev[1]
        );
        world.edges[world.edges.indexOfEdge(edge)].pheromone = 255;
        
        this.x = prev[0];
        this.y = prev[1];
        if (this.x==pad && this.y==pad) {
            this.path = [[pad, pad]];
            this.forward = true;
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
