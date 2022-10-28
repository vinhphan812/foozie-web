const mongoose = require("mongoose");
const redis = require("redis");

const { db_url, db_user, db_pass, db_name, redisURL, redisKey } = process.env;

const redisClient = redis.createClient({
	url: redisURL,
	password: redisKey,
});

redisClient.on("error", (err) => {
	console.log("REDIS ERROR - " + err);
});

redisClient.on("connect", (stream) => {
	console.log("Redis CONNECTED...");
});

redisClient.connect();

module.exports = {
	initDatabase: () => {
		// connect database from .env
		if (db_url)
			mongoose.connect(db_url, {
				user: db_user,
				pass: db_pass,
				dbName: db_name,
			});
	},
	redisClient,
};
