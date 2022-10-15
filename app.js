// environment config from .env
require("dotenv").config();

//require all model
require("./models");

const path = require("path");

// import modules
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const morgan = require("morgan");
const favicon = require("serve-favicon");

const { errorMiddleware } = require("./middlewares/error.middleware");
const userMiddleware = require("./middlewares/user.middleware");

const admin = require("firebase-admin");

const serviceAccount = require("./food-services-1de98-firebase-adminsdk-b0y0g-92b348c858.json");

// import route
const apiRoute = require("./api/routers/index.route");
const authRoute = require("./api/routers/auth.route");
const authFERoute = require("./routers/auth.route");

const { morganConfig } = require("./utils/constaints");
const { seoConfigMiddleware } = require("./middlewares/SeoConfigMiddleware");
const { home } = require("./controllers/home.controller");

const { db_url, db_user, db_pass, db_name, SECRET_KEY, APP_NAME } = process.env;

// get PORT
const PORT = process.env.port || 3000;

// connect database from .env
if (db_url)
	mongoose.connect(db_url, {
		user: db_user,
		pass: db_pass,
		dbName: db_name,
		connectTimeoutMS: 500,
	});

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
});

// init app
const app = express();

// use cookies
app.use(cookieParser(SECRET_KEY));

// use middleware
app.use(morgan(morganConfig));

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/public", express.static(path.join(__dirname, "public")));
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "./views"));
app.use(favicon("./public/images/assets/restaurant.png"));

app.use(seoConfigMiddleware);

// GET USER IF AUTH OR NEXT
app.use(userMiddleware);

// use route
app.use("/api", apiRoute);
app.use("/auth", authRoute);
app.use("/", authFERoute);

app.get("/", home);

app.use(errorMiddleware);

app.listen(PORT, () => {
	console.log(`server run in port ${PORT}`);
});
