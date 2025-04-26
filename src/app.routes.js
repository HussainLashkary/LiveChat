const { Router } = require("express");
const { AuthRoutes } = require("./modules/auth/auth.routes");
const { checkAuth } = require("./middleware/auth.guard");
const { namespaceRoutes } = require("./modules/conversation/namespace.routes");
const { RoomRoutes } = require("./modules/conversation/room.routes");

const mainRouter = Router();

mainRouter.use("/auth", AuthRoutes);
mainRouter.use("/namespace", namespaceRoutes)
mainRouter.use("/room", RoomRoutes)
mainRouter.get("/chat", checkAuth, (req, res) => {
    res.render("chat");
})

module.exports = mainRouter;