const { User, Branch, Food } = require("../../models");

module.exports = {
     deleteUser: async (req, res, next) => {
          const { id } = req.params;
          await User.updateOne({ _id: id }, { $set: { is_delete: true } });

          res.json({ success: true, message: "User deleted successfully" });
     },
     deleteBranch: async (req, res, next) => {
          const { id } = req.params;
          await Branch.updateOne({ _id: id }, { $set: { is_delete: true } });

          res.json({ success: true, message: "Branch deleted successfully" });
     },
     uploadFoodImageHandle: async (req, res, next) => {
          const { id } = req.params;
          const thumbnail = "/" + req.file.path.split("\\").join("/");

          await Food.updateOne({ _id: id }, { $set: { thumbnail } });

          res.json({
               success: true,
               message: "Upload Image Food Success",
               data: thumbnail,
          });
     },
};
