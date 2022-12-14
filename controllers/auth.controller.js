const md5 = require("md5");
const { User } = require("../models");

module.exports = {
     loginPage: (req, res, next) => {
          res.locals.seo.title = "Đăng Nhập";
          res.render("users/sign_in");
     },
     registerPage: (req, res, next) => {
          res.locals.seo.title = "Đăng Ký";
          res.render("users/sign_up");
     },
     loginHandle: async (req, res, next) => {
          res.locals.seo.title = "Đăng Nhập";
          const { user, pass } = req.body;
          const errors = [];
          res.locals.login = { user, pass };

          const userData = await User.findOne({
               $or: [{ username: user }, { email: user }, { phone: user }],
               password: md5(pass),
               is_delete: false,
          });

          if (!userData) {
               errors.push("Tài khoản, mật khẩu bạn vừa nhập chưa đúng");
               res.render("users/sign_in", { errors });
          } else {
               res.cookie("userId", userData.id, { signed: true });
               res.redirect(userData.role == "CUSTOMER" ? "/" : "/admin");
          }
     },

     forgotHandle: (req, res, next) => {
          const { email } = req.body;

          //! send mail

          res.json({ success: true, message: "SEND_MAIL_SUCCESS" });
     },

     signUpHandle: async (req, res, next) => {
          res.locals.seo.title = "Đăng Ký";
          const { body, errors } = res.locals;

          if (errors.length) {
               return res.render("users/sign_up");
          }

          body.password = md5(body.password);

          const userCreated = await User.create(body);

          res.redirect("/sign_in");
     },

     logoutHandle: (req, res, next) => {
          res.clearCookie("userId").redirect("/");
     },
};
