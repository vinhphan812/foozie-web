function Alert(title, text, confirmButtonText, icon = "error") {
	return Swal.fire({
		heightAuto: false,
		title,
		text,
		icon,
		confirmButtonText,
		timer: 1000,
		timerProgressBar: true,
	});
}

function confirmDelete(name = "giải", cb) {
	Swal.fire({
		customClass: {
			confirmButton: "btn btn-success mx-2",
			cancelButton: "btn btn-danger mx-2",
		},
		buttonsStyling: false,
		title: "Xóa " + name,
		text: `Bạn chắc chắn muốn xóa?`,
		showCancelButton: true,
		confirmButtonText: "Xóa",
		cancelButtonText: "Quay lại",
		showLoaderOnConfirm: true,
		preConfirm: cb,
		reverseButtons: true,
	});
}
