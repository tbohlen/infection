class Person {
    constructor(age, x, y, w, h, infected) {
        this.state = infected ? INFECTED : HEALTHY;
        this.nextState = this.state;
        this.incubationDay = 0;
        this.age = age;
        this.x = x;
        this.y = y;
        this.width = map(this.age, 0, 100, w, w/3);
        this.height = map(this.age, 0, 100, h, h/3);
    }

    draw() {
        var ageAlpha = 255;//map(this.age, 0, 100, 255, 150);
        HEALTHY_COLOR.setAlpha(ageAlpha);
        INFECTED_COLOR.setAlpha(ageAlpha);
        IMMUNE_COLOR.setAlpha(ageAlpha);
        DEAD_COLOR.setAlpha(ageAlpha);
        if (this.state === HEALTHY) fill(HEALTHY_COLOR);
        if (this.state === INFECTED) fill(INFECTED_COLOR);
        if (this.state === IMMUNE) fill(IMMUNE_COLOR);
        if (this.state === DEAD) fill(DEAD_COLOR);

        noStroke();
        rect(this.x, this.y, this.width, this.height);
    }

    haveDay(contacts) {
        this.nextState = this.state;
        var todaysQuarentine = quarentine()
        if (this.state === HEALTHY) {
            for (var contact of contacts) {
                if (random() < todaysQuarentine && contact.isInfected() && random() < INFECT_CHANCE) {
                    this.nextState = INFECTED;
                }
            }
        }
    }

    endDay(overburdened) {
        if (this.state === INFECTED) {
            this.incubationDay++;
        }

        this.state = this.nextState;

        if (this.state === INFECTED && this.incubationDay === INCUBATION) {
            if (random() < deathrate(this.age, overburdened)) this.state = DEAD;
            else this.state = IMMUNE;
        }
    }

    isInfected() {
        return this.state === INFECTED;
    }
    isDead() {
        return this.state === DEAD;
    }
    isImmune() {
        return this.state === IMMUNE;
    }
    isHealthy() {
        return this.state === HEALTHY;
    }
}
