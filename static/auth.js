$(() => {
	$("#name-input-form").submit((event) => {
		if ($("#name").val().match(/^[a-zA-Zа-яА-Я]{1,15}$/) === null) {
			alert('Invalid name entered');
			event.preventDefault();
			return;
		}
	});
});