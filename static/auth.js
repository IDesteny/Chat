$(() => {
	$("#name-form").submit((event) => {
		const $input = $("#name");
		if (checkOfCorrectName($input.val())) {
			alert("Error!");
			$input.val('');
			event.preventDefault();
			return;
		}
	});
});