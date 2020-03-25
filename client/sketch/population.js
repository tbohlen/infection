class Population {
    constructor(size, pixelWidth, pixelHeight) {
        this.size = size;
        this.arrayWidth = 2*floor(pow(this.size/2, 1/2));
        this.arrayHeight = this.size/this.arrayWidth;
        this.people = [];
        this.personWidth = pixelWidth/this.arrayWidth;
        this.personHeight = pixelHeight/this.arrayHeight;
        this.pixelWidth = pixelWidth;
        this.pixelHeight = pixelHeight;
        for (var i = 0; i < this.arrayWidth; i++) {
            var row = [];
            for (var j = 0; j < this.arrayHeight; j++) {
                // create person with random age
                // For some reason they are ending up a little lower on the screen than they should...
                row.push(new Person(
                    random(0, 100),
                    (i+0.5)*this.personWidth,
                    (j+0.5)*this.personHeight,
                    this.personWidth,
                    this.personHeight,
                    random() < INITIAL_INFECTION_COUNT/this.size))
            }
            this.people.push(row);
        }
        console.log(this.people.length*this.people[0].length)
        this.graph = new PopulationGraph(0, pixelHeight+GRAPH_BUFFER, width, height - pixelHeight - GRAPH_BUFFER);
        // SETTING: Change this to another network function to modify how we choose
        // which people interact each day
        this.neighbors = this.buildVariableSize2DNetwork()
        this.overburdened = false;
    }

    buildSimpleNetwork() {
        var neighbors = [];
        for (var i = 0; i < this.arrayWidth; i++) {
            var row = [];
            for (var j = 0; j < this.arrayHeight; j++) {
                var list = [];
                for (var n = 0; n < 24; n++) {
                    // each person can receive from a random list of 24.
                    // every person has their OWN list of 24, so I might be able
                    // to get infected from you, but you can't infect me.
                    // simple to code but not very realistic
                    list.push(this.people[floor(random(this.arrayWidth))][floor(random(this.arrayHeight))]);
                }
                row.push(list);
            }
            neighbors.push(row);
        }
        return neighbors;
    }

    buildMutualNetwork() {
        var neighbors = [];
        for (var i = 0; i < this.arrayWidth; i++) {
            var row = [];
            for (var j = 0; j < this.arrayHeight; j++) {
                row.push([]);
            }
            neighbors.push(row);
        }
        for (var i = 0; i < this.arrayWidth; i++) {
            for (var j = 0; j < this.arrayHeight; j++) {
                var n = 0;
                var chosen = [];
                while (n < 12) {
                    // each person chooses 12 unique people to connect with
                    // resulting in 24 connections per person on average
                    var ci = floor(random(this.arrayWidth))
                    var cj = floor(random(this.arrayHeight))
                    if (ci === i && cj === j) continue;
                    if (chosen.includes(ci*this.arrayHeight + cj)) continue;
                    chosen.push(ci*this.arrayHeight + cj);
                    neighbors[ci][cj].push(this.people[i][j]);
                    neighbors[i][j].push(this.people[ci][cj]);
                    n++;
                }
            }
        }
        return neighbors;
    }

    buildVariableSize2DNetwork() {
        var neighbors = [];
        for (var i = 0; i < this.arrayWidth; i++) {
            var row = [];
            for (var j = 0; j < this.arrayHeight; j++) {
                var n = constrain(floor(randomGaussian(2, 2)), 1, 10);
                var startX = constrain(i-n, 0, this.arrayWidth-1);
                var startY = constrain(j-n, 0, this.arrayHeight-1);
                var endX = constrain(i+n, 0, this.arrayWidth-1);
                var endY = constrain(j+n, 0, this.arrayHeight-1);
                var list = [];
                for (var x = startX; x <= endX; x++) {
                    for (var y = startY; y <= endY; y++) {
                        list.push(this.people[x][y]);
                    }
                }
                row.push(list);
            }
            neighbors.push(row);
        }
        return neighbors;
    }

    getNeighbors(x, y) {
        // this option uses the persons immediate neighbors in 2D
        // Recomputed ever time so its costly.
        // var startX = constrain(x-2, 0, this.arrayWidth-1);
        // var startY = constrain(y-2, 0, this.arrayHeight-1);
        // var endX = constrain(x+2, 0, this.arrayWidth-1);
        // var endY = constrain(y+2, 0, this.arrayHeight-1);
        // var neighbors = [];
        // for (var i = startX; i <= endX; i++) {
        //     for (var j = startY; j <= endY; j++) {
        //         neighbors.push(this.people[i][j]);
        //     }
        // }
        // return neighbors;

        // this option chooses random neighbors every day
        // Recomputed every time so its costly.
        // var neighbors = [];
        // for (var n = 0; n < 24; n++) {
        //     neighbors.push(this.people[floor(random(this.arrayWidth))][floor(random(this.arrayHeight))]);
        // }
        // return neighbors;

        // this option chooses a set network per person
        return this.neighbors[x][y];
    }

    runDay() {
        // meet all your friends...
        for (var i = 0; i < this.arrayWidth; i++) {
            for (var j = 0; j < this.arrayHeight; j++) {
                this.people[i][j].haveDay(this.getNeighbors(i, j));
            }
        }
        // ...realize we're all infected...
        var cases = this.graph.countCases(this.people);
        // ...and the health care system can't handle it...
        this.overburdened = cases.infected > HEALTH_CARE_CAPACITY*this.size;
        // ...so we die.
        for (i = 0; i < this.arrayWidth; i++) {
            for (j = 0; j < this.arrayHeight; j++) {
                this.people[i][j].endDay(this.overburdened);
            }
        }
    }

    draw() {
        for (var i = 0; i < this.arrayWidth; i++) {
            for (var j = 0; j < this.arrayHeight; j++) {
                this.people[i][j].draw();
            }
        }
        this.graph.draw(this.people, this.overburdened);
    }
}
