const initConnection = (io) => {
    io.on("connection", socket => {
        console.log(socket.rooms)
    })
}

module.exports = {
    initConnection
}