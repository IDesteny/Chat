$(() => {
	const socket = io.connect();

	$("#msg-form").submit((event) => {
		event.preventDefault();

		const $input = $("#msg");
		if (checkOfCorrectMsg($input.val())) {
			alert("Error!");
			$input.val('');
			return;
		}
		socket.emit('send msg', { msg: $input.val() });
		$input.val('');
	});

	socket.on('add msg', (data) => {
		$("#all-msg").append("<div>" + data.name + ': ' + data.msg + "</div>");
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