class PopulationGraph {
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.width = w;
        this.height = h
    }

    bg() {
        rectMode(CORNER);
        noStroke();
        fill(255, 255, 255);
        rect(this.x, this.y, this.width, this.height);
        rectMode(CENTER);
    }

    countCases(people) {
        var infected = 0;
        var healthy = 0;
        var dead = 0;
        var immune = 0;
        for (var i = 0; i < people.length; i++) {
            var r = people[i]
            for (var j = 0; j < r.length; j++) {
                if (people[i][j].isHealthy()) healthy++
                if (people[i][j].isImmune()) immune++
                if (people[i][j].isInfected()) infected++
                if (people[i][j].isDead()) dead++
            }
        }
        var total = infected + healthy + dead + immune;
        return { total, infected, healthy, dead, immune};
    }

    draw(people, overburdened) {
        var cases = this.countCases(people);
        // infected, then healthy, then immune, then dead
        noStroke()
        rectMode(CORNER);
        HEALTHY_COLOR.setAlpha(overburdened ? 225 :255);
        INFECTED_COLOR.setAlpha(overburdened ? 225 : 255);
        IMMUNE_COLOR.setAlpha(overburdened ? 225 :255);
        DEAD_COLOR.setAlpha(overburdened ? 225 :255);
        // dead
        var nowX = this.x + GRAPH_BAR_WIDTH * frameCount;
        var nowY = this.y;
        var deadH = (cases.dead/cases.total) * this.height;
        fill(DEAD_COLOR);
        rect(nowX, nowY, GRAPH_BAR_WIDTH, deadH);
        // immune
        nowY += deadH
        var immuneH = (cases.immune/cases.total) * this.height
        fill(IMMUNE_COLOR);
        rect(nowX, nowY, GRAPH_BAR_WIDTH, immuneH);
        // healthy
        nowY += immuneH
        var healthyH = (cases.healthy/cases.total) * this.height
        fill(HEALTHY_COLOR);
        rect(nowX, nowY, GRAPH_BAR_WIDTH, healthyH);
        // infected
        nowY += healthyH
        fill(INFECTED_COLOR);
        rect(nowX, nowY, GRAPH_BAR_WIDTH, this.y + this.height);

        // draw line at overburden
        var overburdenedY = this.y + (1-HEALTH_CARE_CAPACITY)*this.height;
        noFill();
        stroke(0);
        strokeWeight(1);
        line(0, overburdenedY, this.width, overburdenedY);

        // draw dot at top in yellow if quarentined
        var todaysQuarentine = quarentine()
        if (todaysQuarentine < 1) {
            QUARENTINE_COLOR.setAlpha(map(todaysQuarentine, 0, 1, 255, 125))
            fill(QUARENTINE_COLOR);
            noStroke();
            rect(nowX, this.y-4, GRAPH_BAR_WIDTH, 2);
        }

        rectMode(CENTER);
        deadElem.html(`Dead: ${round((cases.dead/cases.total)*1000)/10}%    `)
        immuneElem.html(`Immune: ${round((cases.immune/cases.total)*1000)/10}%`)
    }
}
