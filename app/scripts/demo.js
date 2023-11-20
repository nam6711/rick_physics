let socket = io();

let vid;
function preload() {
    vid = createVideo("https://people.rit.edu/nam6711/rick_roll.mp4");
}

function setup() {
    createCanvas(window.innerWidth - window.innerWidth * .02, window.innerHeight- window.innerHeight * .02);

    vid.size(width, height);
    vid.hide();

    socket.on("rick hold", () => {
        vid.show();
        vid.play();
        console.log("rick start");
    });

    socket.on("rick stop", () => {
        vid.pause();
        vid.hide();
        console.log("stop rick");
    });
}

function mouseClicked() {
    socket.emit('listener connect');
}