const { Store, VirtualDisplayVoucher } = require("../models");
const Zalopay = require("../modules/zalopay");

module.exports = {
     Order: async (req, res, next) => {
          const { user } = res.locals;
          res.locals.seo.title = "Thanh Toán";

          res.locals.vouchers = await VirtualDisplayVoucher.myVouchers(
               user._id
          );

          res.render("order/index");
     },
     BuyHandle: async (req, res, next) => {
          const { food, quantity } = req.body;
          const { sessionId } = req.signedCookies;

          if (!food) return res.redirect(req.header("Referer") || "/");

          await Store.addCart(sessionId, food, "INCREASEMENT", +quantity || 1);

          res.redirect("/order");
     },
     zalopayRes: async (req, res, next) => {
          const {
               appid,
               apptransid,
               pmcid,
               bankcode,
               amount,
               discountamount,
               status,
               checksum,
          } = req.query;

          const checksumRes = Zalopay.Hmac(
               `${appid}|${apptransid}|${pmcid}|${bankcode}|${amount}|${discountamount}|${status}`,
               Zalopay.config.key2
          );

          if (checksumRes != checksum) {
               res.sendStatus(400);
          } else {
               res.send(200);
          }
     },
};
