Onload = () => {
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

     changeCart({ food, quantity });
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
