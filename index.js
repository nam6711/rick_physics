const { time } = require('console');
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

// used to hold listeners
let listeners = 0;
let controller;

app.get('/controller', (req, res) => {
  if (!controller) {
    res.sendFile(__dirname + '/app/controller/index.html');
  } else {
    res.sendFile(__dirname + '/app/demo/index.html');
  }
});
app.get('/demo', (req, res) => {
  res.sendFile(__dirname + '/app/demo/index.html');
});
app.get('/rick_roll', (req, res) => {
  res.sendFile(__dirname + '/app/assets/rick_roll.mp4');
});
app.get('/scripts/controller', (req, res) => {
  res.sendFile(__dirname + '/app/scripts/controller.js');
});
app.get('/scripts/demo', (req, res) => {
  res.sendFile(__dirname + '/app/scripts/demo.js');
});

io.on('connection', (socket) => {
  log('a user connected');
  socket.on('disconnect', () => {
    // if controller stop controller actions
    console.log(controller == socket);
    if (controller == socket) {
      log("stop the rick roll");
      socket.broadcast.emit('rick stop');
      controller = undefined;
    } else {
      if (listeners <= 0) {
        listeners = 0;
      } else {
        listeners--;
      }

      if (controller) {
        controller.emit('user count', {
          count: listeners,
        });
      }
    }

    log('user disconnected');
    log(`total users: ${listeners}`);
  });

  /** CONTROLLER CONNECTIONS **/
  socket.on('controller connect', () => {
    // if the controller already exists, then stop this connection
    if (controller) {
      log("Already a controller, disconnecting");
      socket.disconnect()
      return;
    }

    log("Controller connected");
    controller = socket;
  });

  /** LISTENER CONTROLS **/
  socket.on('listener connect', () => {
    listeners++;
    if (controller) {
      controller.emit('user count', {
        count: listeners,
      });
    }
  })

  // RICK CONTROLS
  socket.on('rick hold', () => {
    socket.broadcast.emit('rick hold');
    log("broadcasting the rick roll");
  });
  socket.on('rick stop', () => {
    socket.broadcast.emit('rick stop');
    log("stop the rick roll");
  });

  socket.on('get user count', () => {
    socket.emit('user count', {
      count: listeners,
    });
  });
});

server.listen(process.env.PORT || 3000, () => {
  console.log("listening on *:3000");
});

function log(msg) {
  let timestamp = new Date();
  console.log(`[${timestamp.getHours()}:${timestamp.getMinutes()}:${timestamp.getSeconds()}.${timestamp.getMilliseconds()}] ${msg}`);
}