const { Router } = require("express");
const uploadFile = require("../../utils/multer");
const {addRoom, getListOfRooms} = require("./room.controller")
const router = Router();

router.post("/add", uploadFile.single("image"), addRoom);

module.exports = {
    RoomRoutes: router
}