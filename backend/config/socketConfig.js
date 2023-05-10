const socketConfig = (io) => {
    io.on("connection", (socket) => {
        socket.on("join_room", (data) => {
            socket.join(data);
        });

        socket.on("leave_room", (roomId) => {
            socket.leave(roomId);
        });

        socket.on("add_track", (data) => {
            socket.to(data.room).emit("receive_track", data);
        });

        socket.on("update_links", (data) => {
            socket.to(data.room).emit("receive_links", data);
        });

        socket.on("host_room_dismissed", (data) => {
            socket.to(data).emit("leave_host_room");
        });

        socket.on("settingChanges", (data) => {
            socket.to(data).emit("updateSetting");
        });

        socket.on("image_upload", (data) => {
            socket.to(data.room).emit("rerender_room_images");
        });
    });
}

module.exports = socketConfig;