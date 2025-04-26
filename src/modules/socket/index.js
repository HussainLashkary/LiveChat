const { getIo } = require("../../utils/initSocket");
const { initConnection } = require("./namespace.socket");

const socketHandler = (io) => {
    initConnection(io); //namespaceController function
}

module.exports = socketHandler;