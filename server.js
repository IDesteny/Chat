const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const urlencodedParser = require("body-parser").urlencoded({ extended: false });

app.use('/scripts', express.static('scripts'));

server.listen(process.env.PORT || 80);

app.get('/', (req, res) => {
	res.sendFile(__dirname + '/auth.html');
});

let username;
app.post('/chat', urlencodedParser, (req, res) => {
	res.sendFile(__dirname + '/chat.html');
	username = req.body.value;
});

connections = [];
function get_item(socket) {
	for (let i = 0; i < connections.length; ++i) {
		if (connections[i].socket === socket) {
			return connections[i];
		}
	}
}

function send_connection_event(socket) {
	for (let i = 0; i < connections.length; ++i) {
		if (connections[i].name !== username) {
			socket.emit('update-users', { name: connections[i].name, type: 'add' });
			connections[i].socket.emit('update-users', { name: username, type: 'add' });
		}
	}
}

io.sockets.on('connection', (socket) => {
	connections.push({ name: username, socket: socket });

	send_connection_event(socket);

	socket.on('send-msg', (data) => {
		const user = get_item(socket);

		if (data.type === 'simple') {
			io.sockets.emit('get-msg', { name: user.name, msg: data.msg, type: 'simple' });
		} else {
			for (let i = 0; i < connections.length; ++i) {
				if (connections[i].name === data.name) {
					connections[i].socket.emit('get-msg', { name: user.name, msg: data.msg, type: 'getter' });
				}
			}
			user.socket.emit('get-msg', { name: data.name, msg: data.msg, type: 'sender' });
		}
	});

	socket.on('disconnect', () => {
		const user = get_item(socket);
		io.sockets.emit('update-users', { name: user.name, type: 'delete' });
		connections.splice(connections.indexOf(user), 1);
	});
});