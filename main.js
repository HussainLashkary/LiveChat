const express = require("express");
const app = express();
require("dotenv").config();
const http = require("http");
const server = http.createServer(app);
const port = process.env.PORT || 4000;
const mainRouter = require("./src/app.routes");
const cookieParser = require("cookie-parser")
const session = require("express-session");
const { errorHandler, notFoundHandler } = require("./src/middleware/error.handler");
const socketHandler = require("./src/modules/socket");
const { initializeSocket } = require("./src/utils/initSocket");
const { clientHelper } = require("./src/utils/client");
const io = initializeSocket(server);
socketHandler(io);


app.set("view engine", "ejs");
app.set("views", "./views");
app.use(express.static("public"));
app.use((req, res, next) => {
    res.locals = clientHelper(req, res);
    next()
})
app.use("/uploads", express.static("uploads"));
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cookieParser(process.env.SECRET_KEY));
app.use(session({
    secret: process.env.SECRET_KEY,
    resave: true,
    saveUninitialized: true,
    cookie: {secure: true}
}));

// Error handling middleware
app.get('/favicon.ico', (req, res) => {
    res.status(204).end();
});

app.use(mainRouter);

//call db config here
require("./src/config/dbConfig");


server.listen(port, () => {
    console.log("server run on http://localhost:" + port);
});


app.use(errorHandler);
app.use(notFoundHandler);
