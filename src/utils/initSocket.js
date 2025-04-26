const { Server } = require("socket.io");

const initializeSocket = (server) => {
    return new Server(server, {
        cors: { origin: "*" } 
    });
};

module.exports = { initializeSocket };