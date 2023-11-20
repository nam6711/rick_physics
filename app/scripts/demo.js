let socket;
let logged_in = false;

let vid;
function preload() {
    vid = createVideo("https://rick-physics-f50b6ed65d0f.herokuapp.com/rick_roll");
    // vid = createVideo("http://localhost:3000/rick_roll");
}

function setup() {
    createCanvas(window.innerWidth - window.innerWidth * .02, window.innerHeight- window.innerHeight * .02);

    noStroke();
    fill(255);

    vid.size(width * .9, height * .9);
    vid.position(width * .05, height * .05)
    vid.hide();
}

function draw() {
    background(49);
    if (!logged_in) {
        waveText("Click to log in!");
    } else {
        waveText("LOGGED IN LETS FUCKING GOOOO");
    }
}

function waveText(string) {
    textSize(10);
    let i = 0;
    for (let char of string) {
        text(char, width/2 - (text.length/2 * 10) + (i*10), height/2 + (sin(0.05 * (frameCount + i * 5)) * height * .02))
        i++;
    }
}

function mouseClicked() {
    if (!logged_in) {
        logged_in = true;

        // setup the socket
        socket = io();

        socket.emit('listener connect');

        socket.on("rick hold", () => {
            vid.show();
            vid.play();
        });
    
        socket.on("rick stop", () => {
            vid.pause();
            vid.hide();
        });
    }
}