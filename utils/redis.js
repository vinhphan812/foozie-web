const BRANCHES_KEY = "BRANCHES";
const { Branch } = require("../models/index");
const { redisClient } = require("../configs/config");

async function setCache(key, data) {
	await redisClient.set(key, JSON.stringify(data));
	return data;
}
async function getCache(key) {
	const data = await redisClient.get(key);
	return JSON.parse(data);
}

module.exports = {
	updateBranches: async () => {
		const branches = await Branch.find({});
		await setCache(BRANCHES_KEY, branches);
		return branches;
	},
	getBranches: async () => {
		return await getCache(BRANCHES_KEY);
	},
	getCache,
	setCache,
	BRANCHES_KEY,
};
