const { Router } = require("express");
const uploadFile = require("../../utils/multer");
const {addRoom, getListOfRooms} = require("./room.controller")
const router = Router();

router.post("/add", uploadFile.single("image"), addRoom)
router.get("/list", getListOfRooms)

module.exports = {
    RoomRoutes: router
}