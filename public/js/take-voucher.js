$(".take-voucher-btn").click(async (e) => {
     const id = $(e.target).attr("voucher-id");
     const data = await (
          await fetch("/api/user/take-voucher", {
               method: "POST",
               headers: { "Content-Type": "application/json" },
               body: JSON.stringify({ id }),
          })
     ).json();

     if (data.success) {
          $(e.target).remove();
     }
});
