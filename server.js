const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

app.use('/scripts', express.static('scripts'));

server.listen(process.env.PORT || 80);

let username;
app.get('/', (req, res) => {
	username = req.headers['cookie'];
	res.sendFile(__dirname + (username ? '/chat.html' : '/auth.html'));
});

app.post('/chat', (req, res) => {
	username = req.headers['cookie'];
	res.sendFile(__dirname + '/chat.html');
});

connections = [];
function get_user(socket) {
	for (let i = 0; i < connections.length; ++i) {
		if (connections[i].socket === socket) {
			return connections[i];
		}
	}
}

function getDate() {
	const date_ob = new Date();
	const date = date_ob.getFullYear() + '.'
				+ date_ob.getMonth() + '.'
				+ date_ob.getDate() + ' '
				+ date_ob.getHours() + ':'
				+ date_ob.getMinutes() + ':'
				+ date_ob.getSeconds();

	return date;
}

io.sockets.on('connection', socket => {
	connections.push({ name: username, socket: socket });

	for (let i = 0; i < connections.length; ++i) {
		if (connections[i].name !== username) {
			socket.emit('update-users', { name: connections[i].name, type: 'add' });
			connections[i].socket.emit('update-users', { name: username, type: 'add' });
		}
	}

	socket.on('send-msg', data => {
		const user = get_user(socket);

		if (data.to === null) {
			io.sockets.emit('get-msg', { name: user.name, msg: data.msg, type: 'all' });

		} else {
			for (let i = 0; i < connections.length; ++i) {
				if (connections[i].name === data.to) {
					connections[i].socket.emit('get-msg', { name: user.name, msg: data.msg, type: 'getter' });
				}
			}
			user.socket.emit('get-msg', { name: data.to, msg: data.msg, type: 'sender' });
		}
	});

	socket.on('disconnect', () => {
		const user = get_user(socket);
		io.sockets.emit('update-users', { name: user.name, type: 'delete' });
		connections.splice(connections.indexOf(user), 1);
	});
});