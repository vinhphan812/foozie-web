const { APP_NAME, GOOGLE_SEO_VERIFICATION } = process.env;
const { redisClient } = require("../configs/config");
const Branch = require("../models/branch.model");
const User = require("../models/user.model");
const { BRANCHES_KEY, getBranches, updateBranches } = require("../utils/redis");
const { MENU_BY_ROLE } = require("../utils/role.enum");

module.exports = {
     seoConfigMiddleware: async (req, res, next) => {
          // check user
          const { userId } = req.signedCookies;

          if (userId) {
               const user = await User.get(userId);

               res.locals.menu = MENU_BY_ROLE[user.role];
               res.locals.user = user;
               res.locals.userId = userId;
          }

          // role display UI
          res.locals.listNotDisplaySignNav = ["/sign_in", "/sign_up"];
          res.locals.errors = [];

          // init seo config object saving to locals response storage
          res.locals.seo = {
               googleSiteVerification: GOOGLE_SEO_VERIFICATION,
               title: "",
               description: "",
               keywords: [],
               url: "https://" + req.hostname + req.url,
               image: "",
          };

          let branches = await getBranches();

          if (!branches) {
               branches = await updateBranches();
          }

          res.locals.branches = branches;

          // saving path for check
          res.locals.path = req.url;
          // saving APP_NAME
          res.locals.APP_NAME = APP_NAME;

          next();
     },
};
