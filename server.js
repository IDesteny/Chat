const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const urlencodedParser = require("body-parser").urlencoded({ extended: false });
const fs = require('fs');

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
function get_user(socket) {
	for (let i = 0; i < connections.length; ++i) {
		if (connections[i].socket === socket) {
			return connections[i];
		}
	}
}

function getDate() {
	const date_ob = new Date();
	const date =  date_ob.getFullYear() + '.'
				+ date_ob.getMonth() + '.'
				+ date_ob.getDate() + ' '
				+ date_ob.getHours() + ':'
				+ date_ob.getMinutes() + ':'
				+ date_ob.getSeconds();

	return date;
}

function writeFile(msg) {
	fs.writeFile('info.log', getDate() + ' ' + msg + '\r\n', { flag: 'a' }, (err) => {});
}

io.sockets.on('connection', (socket) => {
	connections.push({ name: username, socket: socket });
	writeFile('User <' + username + '> is connected');

	for (let i = 0; i < connections.length; ++i) {
		if (connections[i].name !== username) {
			socket.emit('update-users', { name: connections[i].name, type: 'add' });
			connections[i].socket.emit('update-users', { name: username, type: 'add' });
		}
	}

	socket.on('send-msg', (data) => {
		const user = get_user(socket);
		let msg;

		if (data.to === null) {
			io.sockets.emit('get-msg', { name: user.name, msg: data.msg, type: 'all' });
			msg = '<' + user.name + '> ' + data.msg;

		} else {
			for (let i = 0; i < connections.length; ++i) {
				if (connections[i].name === data.to) {
					connections[i].socket.emit('get-msg', { name: user.name, msg: data.msg, type: 'getter' });
				}
			}
			user.socket.emit('get-msg', { name: data.to, msg: data.msg, type: 'sender' });

			msg = '<' + user.name + ' => ' + data.to + '> ' + data.msg;
		}

		writeFile(msg);
	});

	socket.on('disconnect', () => {
		const user = get_user(socket);
		io.sockets.emit('update-users', { name: user.name, type: 'delete' });
		connections.splice(connections.indexOf(user), 1);
	});
});