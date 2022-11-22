const axios = require("axios");
const { createHmac } = require("crypto");
const moment = require("moment");
const {
     zalopay_callback,
     zalopay_host: host,
     zalopay_config_app,
} = require("../configs/zalopay.config");

class Zalopay {
     static config = zalopay_config_app;

     static Hmac(data, key) {
          return createHmac("sha256", key).update(data).digest("hex");
     }

     static request({ url, data = {}, params = {} }) {
          return new Promise((resolve, reject) => {
               axios({
                    url,
                    data,
                    params,
                    method: Object.keys(data).length > 0 ? "POST" : "GET",
               }).then(({ data }) => {
                    if (data.returncode == 1) {
                         resolve(data);
                    } else {
                         reject(data.returnmessage);
                    }
               });
          });
     }

     static async getBanks() {
          return new Promise((resolve, reject) => {
               const reqtime = new Date().getTime();
               const mac = this.Hmac(
                    `${this.config.appid}|${reqtime}`,
                    this.config.key1
               );
               const params = { appid: this.config.appid, reqtime, mac };

               axios({
                    url: "https://sbgateway.zalopay.vn/api/getlistmerchantbanks",
                    params,
               }).then(({ data }) => {
                    if (data.returncode == 1) {
                         resolve(data.banks);
                    } else {
                         reject(data.returnmessage);
                    }
               });
          });
     }

     static createOrder(order, hostcb) {
          return new Promise((resolve, reject) => {
               const app_time = new Date().getTime();
               const item = JSON.stringify(
                         order.details.map((detail) => ({
                              itemid: detail._id,
                              itename: detail.name,
                              itemprice: detail.price,
                              itemquantity: detail.quantity,
                         }))
                    ),
                    callback_url = `https:\/\/${hostcb}${zalopay_callback}`,
                    app_user = "Foozie Foods",
                    app_trans_id =
                         moment(app_time).format("YYMMDD") + "_" + order._id,
                    embed_data = JSON.stringify({
                         redirecturl: callback_url,
                    }),
                    dataString = `${this.config.appid}|${app_trans_id}|${app_user}|${order.total}|${app_time}|${embed_data}|${item}`,
                    mac = this.Hmac(dataString, this.config.key1);

               const data = {
                    title: "Thanh Toán Hóa Đơn Foozie Foods",
                    app_id: this.config.appid,
                    app_user,
                    merchant_name: "Foozie Foods",
                    app_trans_id,
                    app_time,
                    amount: order.total,
                    item,
                    description: `Foozie Foods - Thanh Toán Đơn Hàng #${order._id}`,
                    title: "Thanh Toán Foozie Foods",
                    embed_data,
                    callback_url,
                    bank_code: "",
                    dataString,
                    mac,
               };

               console.log(data);

               axios({ url: host + "/create", method: "POST", data }).then(
                    ({ data }) => {
                         console.log(data);
                         resolve(data);
                    }
               );
          });
     }
}

module.exports = Zalopay;
