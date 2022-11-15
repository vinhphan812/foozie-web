const {
     User,
     VirtualDisplayVoucher,
     Notification,
     Order,
     Voucher,
     Store,
     Food,
} = require("../../models");

const {
     TAKE_SUCCESS_VOUCHER,
     MAKE_BODY_MESSAGE_TAKE_VOUCHER,
     TAKE_VOUCHER_HREF,
     DEFAULT_SHIPPING_FEE,
} = require("../../utils/constaints");

const md5 = require("md5");

module.exports = {
     getMe: async (req, res, next) => {
          const { user } = res.locals;

          const myVoucher = await VirtualDisplayVoucher.myVouchers(user.id);

          const myOrderHistory = await Order.getOrders(user.id, false);

          user._doc.myHistoryOrderCount = myOrderHistory.length;
          user._doc.myVoucherCount = myVoucher.length;

          res.json({ success: true, data: user });
     },
     updateMe: async (req, res, next) => {
          try {
               const { id } = res.locals.user;
               const { password, ...user } = req.body;

               const updateUser = await User.updateUser(id, user);

               res.json({ success: true, data: updateUser });
          } catch (e) {
               res.json({ success: false, message: e.message });
          }
     },
     changePassword: async (req, res, next) => {
          const { current_password, new_password } = req.body;
          const { user } = res.locals;

          const currentUser = await User.findOne({ _id: user.id });

          if (currentUser.password != md5(current_password)) {
               return res.json({
                    success: false,
                    message: "CURRENT_PASSWORD_INCORRECT",
               });
          }

          await User.updateUser(currentUser.id, {
               password: md5(new_password),
          });

          res.json({
               success: true,
               message: "CHANGE_PASSWORD_SUCCESS",
          });
     },
     getMyVouchers: async (req, res, next) => {
          const { user } = res.locals;

          const myVoucher = await VirtualDisplayVoucher.myVouchers(user.id);

          res.json({ success: true, count: myVoucher.length, data: myVoucher });
     },

     getMyHistoryOrders: async (req, res, next) => {
          const { is_delete } = req.query;
          const { user } = res.locals;

          const myHistoryOrder = await Order.getOrders(user.id, !!is_delete);

          res.json({ success: true, data: myHistoryOrder });
     },

     getMyNotifications: async (req, res, next) => {
          const { is_delete, limit } = req.query;
          const { user } = res.locals;
          const myNotification = await Notification.getMyNotifications(
               user.id,
               !!is_delete,
               limit
          );
          res.json({ success: true, data: myNotification });
     },

     seenNotifications: async (req, res, next) => {
          const { notify_ids } = req.body;

          const message = await Notification.seen(notify_ids);

          res.json({ success: true, message });
     },

     confirmMail: async (req, res, next) => {
          const { code } = req.body,
               { user } = res.locals;

          if (!code)
               return res.json({
                    success: false,
                    message: "CONFIRM_CODE_REQUIRED",
               });

          const currentDate = new Date();
          const userConfirmMail = await ComfirmMail.findOne({
               user_id: user._id,
          });
          if (!userConfirmMail)
               return res.json({
                    success: false,
                    message: "COMFIRM_NOT_FOUND",
               });

          if (userConfirmMail.expires < currentDate)
               return res.json({
                    success: false,
                    message: "CONFIRM_CODE_EXPIRED",
               });

          if (userConfirmMail.code != code)
               return res.json({ success: false, message: "CONFIRM_FAIL" });

          await User.updateOne(
               { _id: user._id },
               { $set: { isVerifyEmail: true } }
          );

          res.json({ success: true, message: "VERIFY_SUCCESS" });
     },
     createOrder: async (req, res) => {
          const { user } = res.locals;
          const { branch, note, distance, voucher_using, token, delivery } =
               req.body;
          const fee = parseInt(distance) * 5000;
          const shipping_fee =
               fee > DEFAULT_SHIPPING_FEE ? fee : DEFAULT_SHIPPING_FEE;

          const { success, message, total, order_id } = await Order.createOrder(
               user.id,
               branch,
               note,
               voucher_using,
               shipping_fee,
               delivery
          );

          //TODO: create order success up score => up ranking
          if (success) {
               user.upScore(total);
          }

          res.json({ success, message });
     },
     upScore: async (req, res) => {
          const { user } = res.locals;
          const { total } = req.body;

          await user.upScore(total);

          res.json({ success: true, data: user });
     },
     getOrderDetail: async (req, res) => {
          const { id } = req.params;

          const order = await Order.getOrderDetail({ _id: id });

          res.json({ success: true, data: order });
     },
     checkVoucher: async (req, res) => {
          const { id } = req.params;
          const { price, shipping_fee } = req.body;

          if (!price || !shipping_fee)
               return res.json({ success: false, message: "BAD REQUEST" });

          const result = await Voucher.checkValidAndDiscount(
               id,
               price,
               shipping_fee
          );
          res.json(result);
     },
     takeVoucher: async (req, res) => {
          try {
               const { id, token } = req.body;
               const { user } = res.locals;

               const voucher = await Voucher.findOne({ _id: id });

               const isValid = voucher.checkValid();

               const takeLevel = voucher.checkVoucherLevel(
                    user.current_ranking.code
               );

               const takedVoucher = await VirtualDisplayVoucher.findOne({
                    voucher_id: id,
                    user_id: user.id,
               });

               if (takedVoucher) {
                    return res.json({
                         success: false,
                         message: "VOUCHER_TAKED",
                    });
               }

               if (isValid && takeLevel) {
                    await VirtualDisplayVoucher.create({
                         user_id: user.id,
                         voucher_id: id,
                    });
               }

               res.json({
                    success: isValid && takeLevel,
                    message:
                         isValid && takeLevel
                              ? "TAKE_VOUCHER_SUCCESS"
                              : takeLevel
                              ? "TAKE_LEVEL_NOT_ENOUGH"
                              : "VOUCHER_INVALID",
               });
          } catch (error) {
               console.log(error.message);
          }
     },

     uploadAvatar: async (req, res) => {
          const { id } = res.locals.user;
          const avatar = "/" + req.file.path.split("\\").join("/");

          if (!avatar)
               return res.json({
                    success: false,
                    message: "AVATAR_NOT_EXISTED",
               });

          if (!id)
               return res.json({ success: false, message: "NOT_FOUND_USER" });

          const data = await User.updateUser(id, { avatar });

          res.json({ success: true, message: "UPDATE_AVATAR_SUCCESS", data });
     },
};
