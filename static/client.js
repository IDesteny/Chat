$(() => {
	const socket = io.connect();

	$("#msg-form").submit((event) => {
		event.preventDefault();
		const $input = $("#msg");

		let res;
		if ((res = $input.val().match(/^\/[Ss]end_[Oo]nly\s+([a-zA-Zа-яА-Я]\S*)\s+(\S.{0,126}$)/)) !== null)
			if (list_users.indexOf(res[1]) !== -1) {
				socket.emit('send msg only', { name: res[1], msg: res[2] });
				$input.val('');
			}
			else alert('User is not connected');
		else
			if ($input.val().match(/\S.{0,126}$/) !== null) {
				socket.emit('send msg', { msg: $input.val() });
				$input.val('');
			}
	});

	socket.on('add msg', (data) => {
		$("#all-msg").append("<div>" + data.name + ': ' + data.msg + "</div>");
	});

	socket.on('add msg only you', (data) => {
		$("#all-msg").append("<div>" + data.name + ' => you: ' + data.msg + "</div>");
	});

	socket.on('add msg only me', (data) => {
		$("#all-msg").append("<div>" + 'you => ' + data.name + ': '+ data.msg + "</div>");
	});

	socket.on('send all users', (data) => {
		list_users.push(data.name);
		show();
	});

	socket.on('append user', (data) => {
		list_users.push(data.name);
		show();
	});

	socket.on('delete user', (data) => {
		list_users.splice(list_users.indexOf(data.name), 1);
		show();
	});
});