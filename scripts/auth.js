$(() => {
	$("#name-form").submit(() => {
		const name = $("#id-name").val();
		const regex = /^[a-zA-Z]\S/;
		const result = name.match(regex);

		if (result === null) {
			err_invalid_name();
			event.preventDefault();
		}
	});
});