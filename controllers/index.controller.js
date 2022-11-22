const {
     Food,
     FoodType,
     Voucher,
     VirtualDisplayVoucher,
} = require("../models/index");
module.exports = {
     homePage: async (req, res, next) => {
          res.locals.seo.title = "Trang Chủ";
          res.locals.seo.description =
               "Foozie Foods, giao đồ ăn trong 5 phút - Nhanh hơn nữa, nhanh hơn nữa - Đặt ngay";
          res.locals.seo.keywords = [
               "Foozie Home",
               "Foozie Foods",
               "Food Delivery",
          ];

          const foodTypes = await FoodType.find({});
          res.locals.foodTypes = foodTypes || [];

          res.render("home/index");
          res.end();
     },
     searchPage: async (req, res, next) => {
          res.locals.seo.title = "Tìm Kiếm";
          res.locals.seo.description = "Tìm kiếm món ăn trên Foozie Foods";
          res.locals.seo.keywords = [
               "Search Foods",
               "Tìm kiếm món ăn trên Foozie Foods",
               "Search Foozie",
          ];

          let { q, type } = req.query;
          let typeIds = [];

          const foodTypes = await FoodType.find({});

          if (type) {
               type = /ALL/i.test(type) ? ["ALL"] : type.split(",");
               typeIds = type.includes("ALL")
                    ? []
                    : type.map((e) => {
                           return foodTypes.find((f) => f.code == e)?.id || "";
                      });
          } else {
               type = [];
          }

          const $regex = new RegExp(q, "i");

          console.log(typeIds);

          const foods = await Food.find({
               ...(q
                    ? {
                           $or: [
                                {
                                     name: { $regex },
                                },
                                { description: { $regex } },
                           ],
                      }
                    : {}),
               ...(typeIds.length ? { type: { $in: typeIds } } : {}),
          });

          console.log(foods);

          res.locals.body = {
               q,
               type: type || [],
          };
          res.locals.foodTypes = foodTypes || [];
          res.locals.foods = foods || [];
          res.render("home/search");
     },
     vouchers: async (req, res, next) => {
          const { userId } = req.signedCookies;
          let myVouchers = [];

          res.locals.seo.title = "Vouchers";
          res.locals.seo.description =
               "Siêu ưu đãi, khuyến mãi khổng lồ khi đặt đồ ăn trên Foozie Foods";
          res.locals.seo.keywords = [
               "Voucher Foozie Foods",
               "Khuyến Mãi",
               "Khuyến mãi Foozie Foods",
               "Vouchers",
               "Ưu đãi Foozie Foods",
               "Giảm Giá",
          ];
          if (userId)
               myVouchers = (
                    await VirtualDisplayVoucher.find(
                         { user_id: userId },
                         { voucher_id: 1 }
                    )
               ).map((e) => e.voucher_id.toString());

          let data = await Voucher.getValid();

          if (myVouchers.length) {
               data = data.filter((e) => !myVouchers.includes(e.id));
          }

          res.locals.vouchers = data;

          res.render("home/vouchers");
     },
};
