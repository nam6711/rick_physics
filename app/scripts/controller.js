let socket = io();
let user_count = 0;

("use strict");

// global vars
let sendingRick = false;
let buttonFill;

function setup() {
  createCanvas(window.innerWidth - window.innerWidth * .02, window.innerHeight- window.innerHeight * .02);
  ellipseMode(CENTER)
  textAlign(CENTER, CENTER)

  buttonFill = color(255, 50, 50);

  socket.emit('controller connect');
  socket.emit('get user count');
}

function draw() {
  background(49);
  noStroke();
  drawButton();

  fill(255);
  text("Total users: " + user_count, width / 2, height / 4);
}

function drawButton() {
  if (mouseX >= (width / 2 - width * .15) && mouseX <= width / 2 + width * .15 &&
    mouseY >= (height / 2 - height * .15) && mouseY <= height / 2 + height * .15) {
    cursor(HAND);
    if (!sendingRick) {
      fill(255, 100, 100);
    } else {
      fill(buttonFill);
    }
  } else {
    cursor(ARROW)
    fill(buttonFill);
  }
  ellipse(width / 2, height / 2, width * .3);
  fill(255);
  text("CLICK", width / 2, height / 2);

}

function mousePressed() {
  if (
    mouseX >= width / 2 - width * .15 &&
    mouseX <= width / 2 + width * .15 &&
    mouseY >= height / 2 - height * .15 &&
    mouseY <= height / 2 + height * .15
  ) {
    if (!sendingRick) {
      socket.emit("rick hold");
      buttonFill = color(255, 50, 50);
    }
    sendingRick = true;
  }
}

function mouseReleased() {
  if (sendingRick) {
    socket.emit("rick stop");
    buttonFill = color(255, 50, 50);
    sendingRick = false;
  }
}

socket.on('user count', res => user_count = res.count);