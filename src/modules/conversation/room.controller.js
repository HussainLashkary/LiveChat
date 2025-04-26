const { conversationModel } = require("./conversation.model");
const {StatusCodes: HttpStatus} = require("http-status-codes");
const createHttpError = require("http-errors")
const path = require("path")

async function addRoom(req, res, next) {
    try {
        const {name, description, namespace} = req.body;
        await findConversationWithEndpoint(namespace)
        await findRoomWithName(name)

        const filename = req.file.filename;
        const fileuploadPath = req.file.destination;
        const image = path.join(fileuploadPath, filename).replace(/\\/g, "/")
        const room = {name, description, image}
        const conversation = await conversationModel.updateOne({endpoint: namespace}, {
            $push: {rooms: room}
        });
        return res.status(HttpStatus.CREATED).json({
            statusCode: HttpStatus.CREATED,
            data: {
                message: "اتاق مکالمه با موفقیت ایجاد شد"
            }
        })
    } catch (error) {
        next(error)
    }
}
async function getListOfRooms(req, res, next) {
    try {
        const {title, endpoint} = req.body;
        const conversation = await conversationModel.find({}, {rooms: 1});

        return res.status(HttpStatus.OK).json({
            statusCode: HttpStatus.OK,
            data: {
                rooms: conversation.rooms
            }
        })
    } catch (error) {
        next(error)
    }
}

async function findRoomWithName(name) {
    const conversation = await conversationModel.findOne({"rooms.name" : name});
    if (conversation) throw createHttpError.BadRequest("این اسم قبلا انتخاب شده است")
}
async function findConversationWithEndpoint(endpoint) {
    const conversation = await conversationModel.findOne({endpoint});
    if (!conversation) throw createHttpError.NotFound("فضای مکالمه یافت نشد");
    return conversation;
}

module.exports = {
    addRoom,
    getListOfRooms
}
