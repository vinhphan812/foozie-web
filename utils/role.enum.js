const ROLE = {
	ADMIN: "ADMIN",
	CUSTOMER: "CUSTOMER",
	MANAGER: "MANAGER",
};

const PERMISSIONS = { ADMIN: 3, MANAGER: 2, CUSTOMER: 1 };

const MENU_BY_ROLE = {
	ADMIN: [{ name: "Dashboard", link: "/admin" }],
	CUSTOMER: [],
	MANAGER: [],
};

module.exports = { ROLE, PERMISSIONS, MENU_BY_ROLE };
