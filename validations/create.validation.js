const { User, FoodType } = require("../models/index");
const { ROLE } = require("../utils/role.enum");

module.exports = {
     createUserValidation: async (req, res, next) => {
          const {
               username,
               last_name,
               first_name,
               email,
               phone,
               role,
               gender,
               address
          } = req.body;

          const errors = [];

          if (
               !username ||
               !last_name ||
               !first_name ||
               !email ||
               !phone ||
               !role ||
               !gender ||
               !address
          )
               errors.push("Vui lòng điền đầy đủ thông tin...!");

          if (!["male", "female"].includes(gender))
               errors.push("Giới tính không đúng...!");

          if (phone.length != 10)
               errors.push("Định dạng số điện thoại không đúng...!");

          const usernameExisted = await User.findOne({ username });
          const emailExisted = await User.findOne({ email });
          const phoneExisted = await User.findOne({ phone });

          if (usernameExisted) errors.push("Tên đăng nhập đã được đăng ký...!");
          if (emailExisted) errors.push("Email đã được đăng ký...!");
          if (phoneExisted) errors.push("Số điện thoại đã được đăng ký...!");

          res.locals.errors = errors;

          res.locals.body = {
               username,
               last_name,
               first_name,
               email,
               phone,
               role,
               gender,
               address,
               password: "12345678",
          };

          next();
     },
     createBranchValidation: async (req, res, next) => {
          const { name, address, phone, manager } = req.body;

          const errors = [];

          if (!name || !address || !phone)
               errors.push("Vui lòng diền đủ thông tin...!");

          if (phone.length != 10)
               errors.push("Định dạng số điện thoại không đúng...!");

          res.locals.body = {
               name,
               address,
               phone,
          };

          if (manager) {
               const managerData = await User.findOne({ _id: manager });
               if (!managerData) errors.push("Không tìm thấy người quản lý");
               else if (managerData.role != ROLE.MANAGER)
                    errors.push("Người quản lý không có quyền quản lý");
               else {
                    res.locals.body.manager = manager;
               }
          }

          res.locals.errors = errors;

          next();
     },
     createFoodValidation: async (req, res, next) => {
          const { name, price, description, type } = req.body;

          const errors = [];

          if (!req.file && /create/g.test(req.url)) errors.push("Vui lòng tải hình ảnh món ăn...!");

          if (!name || !price) errors.push("Vui lòng diền đủ thông tin...!");

          if (type) {
               const typeData = await FoodType.findOne({ _id: type });

               if (!typeData) errors.push("Loại món ăn không khả dụng...!");
          } else {
               errors.push("Vui lòng phân loại...!");
          }

          res.locals.body = {
               name,
               price,
               description: description || "",
               type,
          };

          res.locals.errors = errors;

          next();
     },
     createCommentValidation: (req, res, next) => {
          const { comment, stars } = req.body;
          if (!comment || !stars) return res.redirect("/");
          next();
     },
};
