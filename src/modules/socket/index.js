const { initConnection, createNamespaceConnection } = require("./namespace.socket");

const socketHandler = (io) => {
    initConnection(io); //namespaceController function
    createNamespaceConnection(io);
}

module.exports = socketHandler;