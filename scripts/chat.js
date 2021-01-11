$(() => {
	const socket = io.connect();

	$("#msg-form").submit(event => {
		event.preventDefault();
		const msg = $("#msg").val();

		if (msg.match(/^\S.*/) === null)
			err_invalid_msg();
		else {
			socket.emit('send-msg', { msg: msg, to: send_him });
		}
		
		$("#msg").val('');
	});

	socket.on('get-msg', data => {
		add_msg(data);
	});

	socket.on('update-users', data => {
		update_users(data);
	});
});