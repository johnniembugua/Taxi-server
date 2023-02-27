
// const { adminServer } = require("./services/amin.server");
// const { authServer } = require("./services/auther.server");
// const { organizationServer } = require("./services/organization.server");

function initRealTimeServer(server) {

    const realTimeServer = require("socket.io")(server);

    realTimeServer.on("connection", (socket) => {
        console.log(`Connected ${socket.id}`);

        // socket.join("63f906fdfe9fefda56832c3b");
        // listenChanges(socket, realTimeServer);
    });

}


function listenChanges(socket, realTimeServer) {

    // authServer(socket, realTimeServer);
    // adminServer(socket, realTimeServer);
    // organizationServer(socket, realTimeServer);

}

module.exports = { initRealTimeServer, };