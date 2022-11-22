const { SCHEMA_OPTION, ignoreModel } = require("../utils/constaints");
const Ranking = require("./ranking.model");

const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema(
     {
          username: String,
          password: String,
          email: String,
          phone: String,
          first_name: String,
          gender: { type: String, enum: ["male", "female"], default: "male" },
          address: String,
          last_name: String,
          isVerifyMail: { type: Boolean, default: false },
          avatar: { type: String, default: "" },
          current_ranking: {
               type: Schema.Types.ObjectId,
               default: "6220f056e746d247310976e4",
               ref: "RANKING",
          },
          role: {
               type: String,
               default: "CUSTOMER",
               enum: ["CUSTOMER", "MANAGER", "ADMIN"],
          },
          score: { type: Number, default: 0 },
          is_delete: { type: Boolean, default: false },
     },
     SCHEMA_OPTION
);

userSchema.static({
     get: async function (_id) {
          return await this.findOne(
               { _id },
               ignoreModel(["password"])
          ).populate(["current_ranking"]);
     },
     updateUser: async function (_id, $set) {
          await this.updateOne({ _id }, { $set });
          return this.get(_id);
     },
});

userSchema.method({
     upScore: async function (total) {
          const score = this.score + total * 0.001;
          await this.updateOne({ score });
          this.score = score;

          const rankingList = await Ranking.find({});

          for (const ranking of rankingList.reverse())
               if (
                    this.score >= ranking.min_exp &&
                    ranking.id != this.current_ranking.id
               ) {
                    await this.updateOne({ current_ranking: ranking.id });

                    this.current_ranking = ranking;

                    //TODO: create Notification

                    break;
               }
     },
});

const User = mongoose.model("USER", userSchema, "USER");

module.exports = User;
