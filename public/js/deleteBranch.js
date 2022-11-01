window.onload = () => {
	$(".delete").click((e) => {
		const parent = e.target.parentNode.parentNode;
		const id = $(parent).attr("branch-id");

		Swal.fire({
			title: "Bạn có chắc?",
			text: "Bạn có chắc muốn xóa chi nhánh này?",
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#3085d6",
			cancelButtonColor: "#d33",
			confirmButtonText: "Chắc chắn!",
			cancelButtonText: "Hủy",
		}).then(async (result) => {
			if (result.isConfirmed) {
				const { success, message } = await (
					await fetch("/api/admin/branches/" + id, {
						method: "DELETE",
					})
				).json();
				if (!success)
					return Swal.fire(
						"Oops...!",
						"Xảy ra lỗi trong quá trình gửi yêu cầu: " +
							message,
						"error"
					);
				parent.remove();
				Swal.fire("Đã xóa thàng công!", "Thành công", "success");
			}
		});
	});
};
