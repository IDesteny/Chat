list_msg = [];
list_users = [];

const add_msg = data {
	list_msg.push(data);

	switch (data.type) {
		case 'all':
			$("#msgs").append("<div>" + data.time + ' &#60;' + data.name + '&#62; ' + data.msg + "</div>");
		break;

		case 'sender':
			$("#msgs").append("<div>" + data.time + ' &#60;you => ' + data.name + '&#62; ' + data.msg + "</div>");
		break;

		case 'getter':
			$("#msgs").append("<div>" + data.time + ' &#60;' + data.name + ' => you&#62; ' + data.msg + "</div>");
		break;
	}
}

const update_users = data {
	if (data.type === 'add') {
		list_users.push(data.name);
		$("#users").append("<div onclick=\"send_only(this)\">" + data.name + "</div>");

	} else {
		list_users.splice(list_users.indexOf(data.name), 1);
		$("#users").empty();
		for (let i = 0; i < list_users.length; ++i) {
			$("#users").append("<div onclick=\"send_only(this)\">" + list_users[i] + "</div>");
		}
	}
}

$("#clear-msg").click(() => {
	$("#msgs").empty();
	list_msg = [];
});

let send_him = null;
const send_only = elementId {
	$("#info").empty();
	send_him = elementId.innerText;
	$("#info").append("<div>" + 'send only ' + '"' + send_him + '" (click on me to cancel)' + "<div>");
}

const err_invalid_msg = () {
	alert('Invalid message entered');
}

$("#info").on('click', () => {
	$("#info").empty();
	send_him = null;
});

