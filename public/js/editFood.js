async function postImageHandle() {
     const inpImg = $("#img")[0];
     if (inpImg.files.length) {
          const formData = new FormData();
          formData.append("image", inpImg.files[0]);

          const res = await (
               await fetch(`/api/admin/foods/#{body.id}/upload`, {
                    method: "POST",
                    body: formData,
               })
          ).json();

          if (res.success) {
               document.getElementById("edit-avatar").src = res.data;
          }
     }
}
