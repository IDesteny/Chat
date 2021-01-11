$(() => {
	$("#name-form").submit(() => {
		const name = $("#id-name").val();
		
		if (name.match(/^[a-zA-Z]\S/) === null) {
			err_invalid_name();
			event.preventDefault();
		} else
			document.cookie = name;
	});
});