const axios = require("axios");
const { createHmac } = require("crypto");
const moment = require("moment");
const { resolve } = require("path");

const test_redirect_path = "";

const host = "https://sb-openapi.zalopay.vn/v2";

class Zalopay {
     static config = {
          appid: 2553,
          key1: "PcY4iZIKFCIdgZvA6ueMcMHHUbRLYjPL",
          key2: "kLtgPl8HHhfvMuDHPwKfgfsY4Ydm9eIz",
     };

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

     static createOrder(order, amount = 10000) {
          const app_time = new Date().getTime();
          const item = JSON.stringify(order.details.map(detail)),
               app_user = "ZaloPayDemo",
               app_trans_id =
                    moment(app_time).format("YYMMDD") + "_" + order._id,
               embed_data = JSON.stringify({}),
               dataString = `${this.config.appid}|${app_trans_id}|${app_user}|${amount}|${app_time}|${embed_data}|${item}`,
               mac = this.Hmac(dataString, this.config.key1);

          const data = {
               app_id: this.config.appid,
               app_user,
               app_trans_id,
               app_time,
               amount,
               item,
               description: `Foozie Foods - Thanh Toán Đơn Hàng #${order._id}`,
               embed_data,
               bank_code: "zalopayapp",
               dataString,
               mac,
          };
          console.log(data);
          axios({ url: host + "/create", method: "POST", data }).then((res) => {
               console.log(res);
          });
     }
}

module.exports = Zalopay;
