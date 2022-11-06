module.exports = {
     index: (req, res, next) => {
          res.locals.seo.title = "Tin Nhắn";
          res.render("admin/chat");
     },
};
