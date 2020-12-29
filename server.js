const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const urlencodedParser = require("body-parser").urlencoded({extended: false});

server.listen(process.env.PORT || 80);

connections = [];

function getIndex(socket) {
	let index;
	for (let i = 0; i < connections.length; ++i)
  		if (connections[i].socket == socket) index = i;
  	return index;
}

app.get('/', (req, res) => {
	res.sendFile(__dirname + '/index.html');
});

let name;
app.post('/chat', urlencodedParser, (req, res) => {
	res.sendFile(__dirname + '/chat.html');
	name = req.body.name;
});

io.sockets.on('connection', (socket) => {
	connections.push({ name: name, socket: socket });

	for (let i = 0; i < connections.length; ++i)
		if (connections[i].name !== name) socket.emit('send all users', {name: connections[i].name});

	for (let i = 0; i < connections.length; ++i)
		if (connections[i].name !== name) connections[i].socket.emit('append user', {name: name});

	socket.on('disconnect', (data) => {
		const index = getIndex(socket);
		io.sockets.emit('delete user', { name: name });
		connections.splice(index, 1);
	});

	socket.on('send msg', (data) => {
		const index = getIndex(socket);
		io.sockets.emit('add msg', { name: connections[index].name, msg: data.msg });
	});
});