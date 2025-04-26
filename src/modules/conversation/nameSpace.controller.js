const createHttpError = require("http-errors");
const { conversationModel } = require("./conversation.model");
const {StatusCodes: HttpStatus} = require("http-status-codes");

async function addNamespace(req, res, next) {
    try {
        const {title, endpoint} = req.body;
        await findNamespaceWithEndpoint(endpoint);
        const conversation = await conversationModel.create({title, endpoint});
        return res.status(HttpStatus.CREATED).json({
            statusCode: HttpStatus.CREATED,
            data: {
                message: "فضای مکالمه با موفقیت ایجاد شد"
            }
        })
    } catch (error) {
        next(error)
    }
}
async function getListOfNamespaces(req, res, next) {
    try {
        const {title, endpoint} = req.body;
        const namespaces = await conversationModel.find({}, {rooms: 0});

        return res.status(HttpStatus.OK).json({
            statusCode: HttpStatus.OK,
            data: {
                namespaces
            }
        })
    } catch (error) {
        next(error)
    }
}

async function findNamespaceWithEndpoint(endpoint) {
    const conversation = await conversationModel.findOne({endpoint});
    if (conversation) throw createHttpError.BadRequest("این اسم قبلا انتخاب شده است")
}

module.exports = {
    addNamespace,
    getListOfNamespaces
}