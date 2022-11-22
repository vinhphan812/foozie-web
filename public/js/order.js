$("#save-voucher").click(async (e) => {
     const $voucher = $("input[name='voucher-selector']:checked");
     const shipping_fee = +$("input[name='shipping_fee']").val();
     const price = +$("input[name='total']").val();
     const $discount = $("#discount");
     const $total = $("#total");
     const $voucherBtn = $(".voucher-select");
     const $inpVoucher = $("input[name='voucher']");

     if ($voucher.length) {
          const id = $voucher.val();
          const res = await (
               await fetch("/api/user/check-voucher/" + id, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ price, shipping_fee }),
               })
          ).json();
          if (res.success) {
               $inpVoucher.val(id);

               $voucherBtn.html(
                    `Sử dụng: <span class="fw-bold">${$(
                         "label",
                         $voucher.parent()
                    ).text()}</span>`
               );

               $discount.removeClass("d-none");

               $("span:nth-child(2)", $discount).text(
                    "-" +
                         res.data.discount.toLocaleString("vi", {
                              style: "currency",
                              currency: "VND",
                         })
               );
               $("span:nth-child(2)", $total).text(
                    (res.data.price + res.data.shipping_fee).toLocaleString(
                         "vi",
                         {
                              style: "currency",
                              currency: "VND",
                         }
                    )
               );
          } else {
               $inpVoucher.val("");
               $voucherBtn.text("Chọn voucher");
               $voucher.prop("checked", false);
               $discount.addClass("d-none");
               Swal.fire({
                    icon: "error",
                    title: "Oops...!",
                    text: term.get(res.message),
               });
          }
     }
});

$("input[name='voucher']").dblclick((e) => {
     e.target.checked = false;
});

const term = {
     get: function (term) {
          return this[term] || term;
     },
     PRICE_NOT_ENOUGH_USING_VOUCHER:
          "Số tiền đơn hàng không đủ để áp dụng giảm giá",
     SOLD_OUT: "Rất tiếc! giảm giá đã được sử dụng hết",
     EXPIRED: "Rất tiếc! giảm giá đã hết hạn",
};

// static public double distanceCalculate(LatLng latLng1, LatLng latLng2) {
//      double R = 6371; // radius Earth

//      double Phi1 = latLng1.latitude * Math.PI / 180;
//      double Phi2 = latLng2.latitude * Math.PI / 180;

//      double deltaPhi = (latLng2.latitude - latLng1.latitude) * (Math.PI / 180);
//      double deltaLambda = (latLng2.longitude - latLng1.longitude) * (Math.PI / 180);

//      double a = Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) + Math.cos(Phi1) * Math.cos(Phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);

//      double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

//      return R * c;
//  }
