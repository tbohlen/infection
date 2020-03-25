var population;
var deadElem;
var immuneElem;
var FRAME_RATE = 10;
var IMMUNE_COLOR;
var HEALTHY_COLOR;
var INFECTED_COLOR;
var DEAD_COLOR;
var GRAPH_BG_COLOR;
var QUARENTINE_COLOR;
var GRAPH_HEIGHT = 200;
var GRAPH_BUFFER = 20
var GRAPH_BAR_WIDTH = 2;
var PIXEL_SIZE = 500;
var HEALTHY = "HEALTHY";
var INFECTED = "INFECTED";
var IMMUNE = "IMMUNE";
var DEAD = "DEAD";

// SETTINGS
var POPULATION = 25000;
// chance of an infected person infecting a healthy person when they meet them
// think of this as the chance of infection during a handshake
var INFECT_CHANCE = 0.008;
// how long someone has the virus before becoming immune or dying
var INCUBATION = 21;
// Average number of people who start off with the disease.
// This is used to randomize the start, so you might end up with more or less!
var INITIAL_INFECTION_COUNT = 5;
// Percent of the total population that must be infected at one time in order
// to overwhelm the health care system. This is not just
// (number of hospital beds/population)
var HEALTH_CARE_CAPACITY = 0.1;

// also a SETTING.
// tells you the likelihood of dying from the virus given your age and whether
// the healthcare system is currently overburdened.
function deathrate(age, overburdened) {
    if (age < 10) return overburdened ? 0.01 : 0;
    if (age < 50) return overburdened ? 0.02 : 0.01;
    if (age < 70) return overburdened ? 0.2 : 0.1;
    return overburdened ? 0.4 : 0.2;
}

// also a SETTING
// returns the percent of someone's normal contacts that they meet in a given day
// so returning 0.5 means a person has 50% fewer opportunities to contract/pass
// the virus in a given day
function quarentine() {
    if (frameCount < 40) return 1;
    if (frameCount < 100) return 0.5;
    return 1;
}

function setup() {
    IMMUNE_COLOR = color(98, 220, 38);
    HEALTHY_COLOR = color(255, 255, 255);
    INFECTED_COLOR = color(148, 44, 255);
    DEAD_COLOR = color(246, 57, 43);
    QUARENTINE_COLOR = color(250, 191, 44);
    GRAPH_BG_COLOR = color(12, 52, 71);

    createCanvas(PIXEL_SIZE*2, PIXEL_SIZE + GRAPH_HEIGHT + GRAPH_BUFFER);
    background(GRAPH_BG_COLOR);
    frameRate(FRAME_RATE);
    rectMode(CENTER);

    population = new Population(POPULATION, PIXEL_SIZE*2, PIXEL_SIZE);
    deadElem = createSpan("Dead: 0%    ");
    immuneElem = createSpan("Immune: 0%");
}

function draw() {
    rectMode(CORNER);
    noStroke();
    if (quarentine() < 1) {
        // in quarentine
        fill(255, 255, 255);
        rect(0, 0, PIXEL_SIZE*2, PIXEL_SIZE+(GRAPH_BUFFER*0.25))
        QUARENTINE_COLOR.setAlpha(map(quarentine(), 0, 1, 50, 100))
        fill(QUARENTINE_COLOR);
        rect(0, 0, PIXEL_SIZE*2, PIXEL_SIZE+(GRAPH_BUFFER*0.25))
    } else {
        fill(240);
        rect(0, 0, PIXEL_SIZE*2, PIXEL_SIZE+(GRAPH_BUFFER*0.25))
    }
    rectMode(CENTER); // center-placed rects are used for drawing people
    population.runDay();
    population.draw();
}
