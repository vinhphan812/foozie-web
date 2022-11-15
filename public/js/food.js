window.onload = () => {
     $(".slick").slick({
          slidesToShow: 4,
          slidesToScroll: 4,
          draggable: true,
          autoplay: true,
          focusOnSelect: true,
          infinite: true,
          responsive: [
               {
                    breakpoint: 760,
                    settings: {
                         slidesToShow: 2,
                         slidesToScroll: 2,
                    },
               },
               {
                    breakpoint: 980,
                    settings: {
                         slidesToShow: 3,
                         slidesToScroll: 3,
                    },
               },
          ],
     });
};

$("#add-cart").click(async (e) => {
     const food = $("input[name=food]").val();
     const quantity = +$("input[name=quantity]").val();

     const data = await (
          await fetch("/api/cart", {
               method: "POST",
               headers: { "Content-Type": "application/json" },
               body: JSON.stringify({ food, quantity }),
          })
     ).json();
     if (data.success) {
          $("#cart-length").text(data.data.length);
          $("#cart").html(
               data.data.map(
                    (
                         e
                    ) => `<div class="d-flex flex-row align-items-center justify-content-between mb-3" food-id="${
                         e._id
                    }">
               <div class="d-flex flex-row">
                    <img class="rounded img-thumbnail" src="${
                         e.thumbnail
                    }" alt="${
                         e.name
                    }" style="width:5rem; height: 5rem; margin-right:10px">
                    <div class="d-flex flex-column">
                         <a class="h5 mb-0 text-decoration-none" href="/foods/${
                              e._id
                         }">${e.name}</a>
                         <div>Đơn giá: ${e.price.toLocaleString("it-IT", {
                              style: "currency",
                              currency: "VND",
                         })}</div>
                         <div class="input-group my-2 w-auto" food-id="${
                              e._id
                         }">
                              <button class="change-cart btn btn-outline-secondary" type="button" data-type="DECREASEMENT"> - </button>
                              <input class="btn btn-outline-secondary text-center disabled" type="text" name="quantity" value="${
                                   e.quantity
                              }" min="1" style="width:50px">
                              <button class="change-cart btn btn-outline-secondary" type="button" data-type="INCREASEMENT">+</button>
                         </div>
                    </div>
               </div>
          </div>`
               )
          );
          $(".change-cart").click(changeHandle);
     }
});

var quantity = 0;
const minus = (e) => {
     if ($("#quantity").val() > 0) {
          var quantity = parseInt($("#quantity").val());
          $("#quantity").val(quantity - 1);
     } else {
          $("#quantity").val(0);
     }
};
const plus = (e) => {
     var quantity = parseInt($("#quantity").val());
     $("#quantity").val(quantity + 1);
};
