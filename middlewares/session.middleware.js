const { Store } = require("../models/index");

module.exports = {
     sessionMiddleware: async (req, res, next) => {
          let { sessionId } = req.signedCookies;
          console.log({ sessionId });
          if (!sessionId) {
               const store = await Store.createCart();

               sessionId = store.id;

               res.cookie("sessionId", store.id, { signed: true });
          }

          const cart = await Store.getCart(sessionId);
          res.locals.cart = cart;

          next();
     },
};
