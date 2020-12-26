const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

server.listen(process.env.PORT || 80);

app.get('/', (req, res) => {
	res.sendFile(__dirname + '/index.html');
});

conections = [];

io.sockets.on('connection', (socket) => {
	conections.push(socket);

	socket.on('disconnect', () => {
		conections.splice(conections.indexOf(socket), 1);
	});

	socket.on('send msg', (data) => {
		io.sockets.emit('add msg', { msg: data });
	});
});