let socket;
Onload = () => {
     const $orders = $("#order-list");
     const $load = $(".loading");
     socket = io("/admin");

     socket.on("order:status", ({ orderId, status }) => {
          if (status == "DONE" || status == "CANCEL") removeOrder(orderId);
          $(`.d-flex[order-id="${orderId}"]>button:last-child`).text(
               button_status_term[status]
          );
     });

     socket.on("orders", (orders) => {
          console.log(orders);
          if (orders.length > 0) {
               $load.remove();

               orders.map((e) => renderOrder(e, $orders));
               addEvent();
          } else {
               $load.html(
                    "<div class='h3 text-muted'>Hiện chưa có đơn hàng nào...!</div>"
               );
          }
     });
};

function removeOrder(id) {
     $("#" + id).fadeOut(1000, function () {
          this.remove();
     });
}

function renderOrder(order, parent) {
     const orderHTML = `<div class="card mb-3 shadow-s" id="${order._id}">
                              <div class="row g-0">
                                   <div class="col-md-1">
                                        <div class="d-flex justify-content-center align-items-center h-100">
                                             <i class="bi bi-box2-heart fs-1"></i>
                                        </div>
                                   </div>
                              <div class="col-md-11 d-flex align-items-center">
                                   <div class="card-body">
                                        <div class="row align-items-center">
                                             <div class="col-md-5 d-flex flex-column small">
                                                  <a class="link-secondary card-title" href="/admin/orders/${
                                                       order._id
                                                  }">#${order._id}</a>
                                                  <p class="card-text h6">
                                                       <span class="text-muted">Giao tới: </span>
                                                       <span>${
                                                            order.delivery
                                                       }</span>
                                                  </p>
                                                  <p class="card-text text-muted small">${moment(
                                                       order.order_date
                                                  ).format(
                                                       (new Date() -
                                                            order.order_date) /
                                                            (1000 *
                                                                 60 *
                                                                 60 *
                                                                 24) >=
                                                            1
                                                            ? "DD-MM-yyyy hh:mm"
                                                            : "hh:mm"
                                                  )}</p>
                                             </div>
                                             <div class="col-md-7 d-flex align-items-center justify-content-between">
                                                  <div class="d-flex" order-id="${
                                                       order._id
                                                  }">
                                                       <button class="btn btn-danger me-2 cancel-status">Hủy</button>
                                                       <button class="btn btn-outline-primary update-status">${
                                                            button_status_term[
                                                                 order.status
                                                            ]
                                                       }</button>
                                                  </div>
                                                  <div class="h5 card-text d-flex flex-column align-items-center">
                                                       <img src="/public/images/assets/${
                                                            order.payment_method ==
                                                            "PAYMENT"
                                                                 ? "online"
                                                                 : "cod"
                                                       }.png" width="48px" data-bs-toggle="tooltip" data-bs-placement="bottom" title="" data-bs-original-title="${
          payment_term[order.payment_method]
     }" aria-label="${payment_term[order.payment_method]}">
                                                       <div class="h5 card-text">${
                                                            status_pay_term[
                                                                 order
                                                                      .payment_status
                                                            ]
                                                       }</div>
                                                  </div>
                                                  <div class="h5 card-text">${order.total.toLocaleString(
                                                       "vi",
                                                       {
                                                            style: "currency",
                                                            currency: "VND",
                                                       }
                                                  )}</div>
                                             </div>
                                        </div>
                                             <div class="row">
                                                  <ul class="list-group">
                                                       
                                                  </ul>
                                             </div>
                                        </div>
                                   </div>
                              </div>
                         </div>`;
     parent.append(orderHTML);
}

function renderItem(list) {
     return list.map(
          (e) => `<li class="list-group-item">
     <a class="text-link" href="/foods/${e._id}">${e.name}</a><span> x ${e.quantity}</span>
</li>`
     );
}
function addEvent() {
     $(".cancel-status").click((e) => {
          const orderId = e.target.parentNode.attributes["order-id"].value;

          socket.emit("order:status", { orderId, status: "CANCEL" });
     });
     $(".update-status").click((e) => {
          const orderId = e.target.parentNode.attributes["order-id"].value;
          socket.emit("order:status", { orderId });
     });
}
