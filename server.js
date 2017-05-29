const express = require('express');
const app = express();
// const http = require('http').Server(app);
// const io = require('socket.io')(http);

app.use(express.static('public'));

// app.get('/', function(req, res){
//    res.sendFile(__dirname + '/index.html');
// });
//
// io.on('connection', function(socket){
//   socket.on('chat message', function(msg){
//      io.emit('chat message', msg);
//     console.log('message: ' + msg);
//   });
// });

const port = process.env.PORT || 4040;

app.listen(port, () => console.log('running on port: ', port));
