const express = require('express');
const app = express();
const cors = require('cors');

app.use(cors());

const http = require('http');
const server = http.createServer(app);

const { Server } = require("socket.io");
const io = new Server(server);

// app.get('/', (req,res) => {
//   res.sendFile(__dirname + '/index.html')
// })

app.use(express.static('public'));

let connected = 0;

io.on('connection', (socket) => {
  connected++;
  console.log(`${connected} people online !`)
  io.emit('ONLINE', connected);

  socket.on('disconnect', () => {
    connected--;
    console.log(`${connected} people are online !`)
    io.emit('ONLINE', connected);
  })

  // Identify the connected entity based on the socket's emit event message

  // In case of organizer, event can be

  // 1. ORG SHOW <X>  ``` where X is the question number
  //      -> Respond by emitting NODE SHOW <X> for the audience to listen

  // 2. ORG HIDE
  //      -> Respond by emitting NODE HIDE for the audience to listen

  socket.on('ORG SHOW', (question) => {
    io.emit('NODE SHOW', question);
  });

  socket.on('ORG HIDE', () => {
    io.emit('NODE HIDE');
  });

  socket.on("ORG COFFEE", () => {
    io.emit("NODE COFFEE");
  })

  // In case of audience, event will be
  // AUD <USERNAME> <X> <OPTION>
  //      -> Respond by emitting NODE ANS for organizer to listen

  socket.on('AUD', (data) => {
    console.log(data);

    /*const user = data.user
        const questionNumber = data.questionNumber;
        const answer = data.answer;*/

    io.emit('NODE ANS', data)
  })


});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
