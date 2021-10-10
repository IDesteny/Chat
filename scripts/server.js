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

function get_user_send_to(name) {
	for (let i = 0; i < connections.length; ++i) {
		if (connections[i].name === name) {
			return connections[i].socket;
		}
	}
}

function event_connections_user(socket) {
	for (let i = 0; i < connections.length; ++i) {
		if (connections[i].name !== username) {
			socket.emit('update-users', { name: connections[i].name, type: 'add' });
			connections[i].socket.emit('update-users', { name: username, type: 'add' });
		}
	}
}

function correctTime(time) {
	return String(time).length === 1 ? '0' + time : time;
}

function getTime() {
	const date_ob = new Date();
	const date = correctTime(date_ob.getHours()) + ':' + correctTime(date_ob.getMinutes());

	return date;
}

io.sockets.on('connection', socket => {
	connections.push({ name: username, socket: socket });

	event_connections_user(socket);

	socket.on('send-msg', data => {
		const user = get_user(socket);

		if (data.to === null) {
			io.sockets.emit('get-msg', { name: user.name, msg: data.msg, time: getTime(), type: 'all' });
		} else {
			get_user_send_to(data.to).emit('get-msg', { name: user.name, msg: data.msg, time: getTime(), type: 'getter' });

			user.socket.emit('get-msg', { name: data.to, msg: data.msg, time: getTime(), type: 'sender' });
		}
	});

	socket.on('disconnect', () => {
		const user = get_user(socket);
		io.sockets.emit('update-users', { name: user.name, type: 'delete' });
		connections.splice(connections.indexOf(user), 1);
	});
});