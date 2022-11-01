const BRANCHES_KEY = "BRANCHES";
const FOOD_TYPE_KEY = "FOOD_TYPE";
const { Branch, FoodType } = require("../models/index");
const { redisClient } = require("../configs/config");

async function setCache(key, data) {
	await redisClient.set(key, JSON.stringify(data));
	return data;
}
async function getCache(key) {
	const data = await redisClient.get(key);
	return JSON.parse(data);
}

async function updateFoodType() {
	const data = await FoodType.find({});
	setCache(FOOD_TYPE_KEY, data);
	return data;
}
async function getFoodType() {
	let data = await getCache(FOOD_TYPE_KEY);
	if (!data) data = updateFoodType();
	return data;
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
	getFoodType,
	updateFoodType,
	getCache,
	setCache,
	BRANCHES_KEY,
};
