let io;

const onlineUsers = new Map();

const initializeSocket = (socketIO) => {
    io = socketIO;

    io.on("connection", (socket) => {
        console.log("✅ User Connected:", socket.id);

        // User joins
        socket.on("join", (userId) => {
            onlineUsers.set(userId, socket.id);

            console.log(`User ${userId} joined`);

            // Notify everyone about online users
            io.emit("onlineUsers", Array.from(onlineUsers.keys()));
        });

        // User is typing
        socket.on("typing", ({ senderId, receiverId }) => {
            console.log("Typing Event:", senderId, "->", receiverId);
            const receiverSocket = onlineUsers.get(receiverId);

            if (receiverSocket) {
                io.to(receiverSocket).emit("typing", senderId);
            }
        });

        // User stopped typing
        socket.on("stopTyping", ({ senderId, receiverId }) => {
            const receiverSocket = onlineUsers.get(receiverId);

            if (receiverSocket) {
                io.to(receiverSocket).emit("stopTyping", senderId);
            }
        });
        socket.on("messageDelivered", ({ messageId, senderId }) => {
            console.log("📦 Delivered Event:", messageId, senderId);

            const senderSocket = onlineUsers.get(senderId);

            console.log("Sender Socket:", senderSocket);

            if (senderSocket) {
                io.to(senderSocket).emit("messageDelivered", {
                    messageId,
                });
            }
        });
        socket.on("messageSeen", ({ messageId, senderId }) => {
            const senderSocket = onlineUsers.get(senderId);

            if (senderSocket) {
                io.to(senderSocket).emit("messageSeen", {
                    messageId,
                });
            }
        });
        // User disconnects
        socket.on("disconnect", () => {
            for (const [userId, socketId] of onlineUsers.entries()) {
                if (socketId === socket.id) {
                    onlineUsers.delete(userId);
                    break;
                }
            }

            console.log("❌ User Disconnected:", socket.id);

            // Notify everyone about online users
            io.emit("onlineUsers", Array.from(onlineUsers.keys()));
        });
    });
};

const getReceiverSocket = (userId) => {
    return onlineUsers.get(userId);
};

const getIO = () => io;

module.exports = {
    initializeSocket,
    getReceiverSocket,
    getIO,
};