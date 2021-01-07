list_msg = [];
list_users = [];

function add_msg(name, msg, type) {
	list_msg.push({ name: name, msg: msg, type: type });

	switch (type) {
		case 'simple':
			$("#msgs").append("<div>" + '&#60;' + name + '&#62; ' + msg + "</div>");
		break;

		case 'sender':
			$("#msgs").append("<div>" + '&#60;you => ' + name + '&#62; ' + msg + "</div>");
		break;

		case 'getter':
			$("#msgs").append("<div>" + '&#60;' + name + ' => you&#62; ' + msg + "</div>");
		break;
	}
}

function update_users(name, type) {
	if (type === 'add') {
		list_users.push(name);
		$("#users").append("<div onclick=\"send_only(this)\">" + name + "</div>");

	} else {
		list_users.splice(list_users.indexOf(name), 1);
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
function send_only(elementId) {
	$("#info").empty();
	send_him = elementId.innerText;
	$("#info").append("<div>" + 'send only ' + '"' + send_him + '" (click on me to cancel)' + "<div>");
}

function err_invalid_msg() {
	alert('Invalid message entered');
}

$("#info").on('click', () => {
	$("#info").empty();
	send_him = null;
});

