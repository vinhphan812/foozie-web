$("form#comment").submit((e) => {
     const stars = $("input[name='stars']:checked").val();
     const comment = $("input[name='comment']").val();

     console.log({ stars, comment });

     try {
          if (!comment) {
               throw new Error("Vui lòng nhập nội dung!");
          }

          if (!stars) {
               throw new Error("Vui lòng đánh giá");
          }
          return true;
     } catch (e) {
          Swal.fire({
               icon: "error",
               title: "Oops...",
               text: e.message,
          });
          return false;
     }
});
