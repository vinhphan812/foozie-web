$(".delete").click((e) => {
     const parent = e.target.parentNode.parentNode;

     const id = $(parent).attr("user-id");
     Swal.fire({
          title: "Bạn có chắc?",
          text: "Bạn có chắc muốn xóa người dùng này?",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Chắc chắn!",
          cancelButtonText: "Hủy",
     }).then(async (result) => {
          if (result.isConfirmed) {
               const { success, message } = await (
                    await fetch("/api/admin/users/" + id, {
                         method: "DELETE",
                    })
               ).json();
               if (!success)
                    return Swal.fire(
                         "Oops...!",
                         "Xảy ra lỗi trong quá trình gửi yêu cầu: " + message,
                         "error"
                    );

               parent.remove();

               Swal.fire("Deleted!", "Your file has been deleted.", "success");
          }
     });
});
