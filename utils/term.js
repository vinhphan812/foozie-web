module.exports = {
    status_level: {
        CANCEL: -1,
        PENDING: 0,
        PREPARE: 1,
        SHIPPING: 2,
        DONE: 3
    },
    status_step: [
        {
            status: "CANCEL",
            icon: "x-circle"
        }, {
            status: "PENDING",
            icon: "list-task"
        }, {
            status: "PREPARE",
            icon: "card-checklist"
        }, {
            status: "SHIPPING",
            icon: "box-seam"
        }, {
            status: "DONE",
            icon: "clipboard-check"
        }
    ],
    status: {
        PENDING: "Chờ tiếp nhận",
        PREPARE: "Đang thực hiện",
        SHIPPING: "Đang giao hàng",
        DONE: "Giao hàng thành công",
        CANCEL: "Đơn hàng bị hủy",
    },
    button_status: {
        PENDING: "Tiếp nhận",
        PREPARE: "Món đã sẳn sàng",
        SHIPPING: "Xong",
        CANCEL: "Hủy",
    },
    status_pay: {
        UNPAID: "Chưa thanh toán",
        PAID: "Đã thanh toán",
        CANCEL: "Hủy thanh toán",
    },
    payment_method: {
        PAYMENT: "Zalopay",
        COD: "Thanh toán khi nhận hàng",
    },
};
