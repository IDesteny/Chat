$(() => {
	const socket = io.connect();

	$("#msg-form").submit((event) => {
		event.preventDefault();
		const msg = $("#msg").val();
		const regex = /^\S.*/;
		const res = msg.match(regex);

		if (res === null) {
			err_invalid_msg();
			return;
		}

		if (send_him !== null) {
			socket.emit('send-msg', { msg: msg, name: send_him, type: 'private-msg' });
		} else {
			socket.emit('send-msg', { msg: msg, type: 'simple'});
		}
		
		$("#msg").val('');
	});

	socket.on('get-msg', (data) => {
		add_msg(data.name, data.msg, data.type);
	});

	socket.on('update-users', (data) => {
		update_users(data.name, data.type);
	});
});