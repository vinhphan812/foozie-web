// environment config from .env
require("dotenv").config();

//require all model
require("./models");

// import modules
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const morgan = require("morgan");
const favicon = require("serve-favicon");

const { errorMiddleware } = require("./middlewares/error.middleware");

// import route
const apiRoute = require("./api/routers/index.route");
const indexRoute = require("./routes/index.route");
// import middleware
const { morganConfig } = require("./utils/constaints");
const { seoConfigMiddleware } = require("./middlewares/seo.middleware");
const { sessionMiddleware } = require("./middlewares/session.middleware");

// import config
const { initDatabase } = require("./configs/config");
const SocketInit = require("./sockets");

const { SECRET_KEY } = process.env;

// get PORT
const PORT = process.env.port || 3010;

// init app
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
     cors: {
          origin: ["https://admin.socket.io"],
          credentials: true,
     },
});

SocketInit(io);

initDatabase();

// use cookies
app.use(cookieParser(SECRET_KEY));

// use middleware
app.use(morgan(morganConfig));

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/public", express.static(path.join(__dirname, "public")));
app.use(favicon("./public/images/assets/restaurant.png"));

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "./views"));

app.use(seoConfigMiddleware, sessionMiddleware);

// use route
app.use("/api", apiRoute);
app.use("/", indexRoute);

app.use(errorMiddleware);

server.listen(PORT, () => {
     console.log(`server run in port ${PORT}`);
});
