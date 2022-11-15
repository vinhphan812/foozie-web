const { Store } = require("../models/index");

module.exports = {
     sessionMiddleware: async (req, res, next) => {
          const { sessionId } = req.signedCookies;
          if (!sessionId) {
               const store = await Store.createCart();
               res.cookie("sessionId", store.id, { signed: true });
          }

          const cart = await Store.getCart(sessionId);
          res.locals.cart = cart;

          next();
     },
};
