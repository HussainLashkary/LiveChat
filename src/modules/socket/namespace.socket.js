const { conversationModel } = require("../conversation/conversation.model");
const initConnection = (io) => {
    io.on("connection", async socket => {
        const namespaces = await conversationModel.find({}, {title:1, endpoint: 1}).sort({_id: -1});
        socket.emit("namespacesList", namespaces)
    })
}
const createNamespaceConnection = async (io) => {
    const namespaces = await conversationModel.find({},
         {title:1, endpoint: 1, rooms: 1})
         .sort({_id: -1});
    for (const namespace of namespaces) {
        io.of(`/${namespace.endpoint}`).on("connection", async socket => {
            const conversation = await conversationModel.findOne({endpoint: namespace.endpoint}, {rooms: 1, endpoint: 1}).sort({_id: -1});
            socket.emit("roomList", conversation.rooms)
            socket.on("joinRoom", async room => {
                const lastRoom = Array.from(socket.rooms)[1];
                if (lastRoom) {
                    socket.leave(lastRoom)
                    await getCountOfOnlineUsers(io, namespace.endpoint, room.name)
                }
                socket.join(room.name);
                await getCountOfOnlineUsers(io, namespace.endpoint, room.name);
                confirmMessage(socket, namespace.endpoint, room.name);
                getNewMessage(socket);
                socket.on("disconnect", async () => {
                    await getCountOfOnlineUsers(io, namespace.endpoint, room.name)
                })
            })
        })
    }
}

const getCountOfOnlineUsers = async (io, endpoint, roomName) => {
    const onlineUsers = await io.of(`/${endpoint}`).in(roomName).fetchSockets()
    io.of(`/${endpoint}`).in(roomName).emit("countOfOnlineUsers", Array.from(onlineUsers).length);
}

const getNewMessage = (socket) => {
    socket.on("newMessage", async data => {
        const { message, roomName, endpoint } = data;
        await conversationModel.updateOne({endpoint, "rooms.name": roomName}, {
            $push: {
                "rooms.$.messages": {
                    sender: "6808caf76dba51be12c9a12d",
                    message,
                    dateTime: Date.now()
                }
            }
        })
    })
}
const confirmMessage = async (socket, endpoint, roomName) => {
    const conversation = await conversationModel.aggregate([
        { $match: { endpoint } },
        { $unwind: "$rooms" },  // Flatten rooms array
        { $match: { "rooms.name": roomName } } // Match specific room
    ]);

    if (!conversation.length) {
        socket.emit("error", "Room not found");
        return;
    }
    console.log(conversation[0].rooms.messages)
    socket.emit("confirmMessage", conversation[0].rooms.messages);
};
module.exports = {
    initConnection,
    createNamespaceConnection
}