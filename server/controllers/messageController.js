const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");
const Message = require("../models/Message");
const { getReceiverSocket, getIO } = require("../socket");

// Send Message
const sendMessage = async (req, res) => {
    console.log("1. sendMessage called");
    console.log("req.file =", req.file);
    try {
        const { receiver, text } = req.body;

        console.log("2. Before Cloudinary");

        let imageUrl = "";

        if (req.file) {
            console.log("3. Image found");

            imageUrl = await new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    {
                        folder: "soulmate-chat",
                    },
                    (error, result) => {
                        if (error) return reject(error);

                        console.log("4. Cloudinary finished");

                        resolve(result.secure_url);
                    }
                );

                streamifier.createReadStream(req.file.buffer).pipe(stream);
            });
        }

        console.log("5. Before Message.create");

        if (!receiver) {
            return res.status(400).json({
                message: "Receiver is required",
            });
        }

        console.log("Creating message...");

        const message = await Message.create({
            sender: req.user._id,
            receiver,
            text: text || "",
            image: imageUrl,
            delivered: false,
            seen: false,
        });

        console.log("✅ Message created");
        console.log("Sending response...");

        const receiverSocketId = getReceiverSocket(message.receiver.toString());

        if (receiverSocketId) {
            getIO().to(receiverSocketId).emit("receiveMessage", message);
        }

        res.status(201).json({
            message: "Message sent successfully",
            data: message,
        });

    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

// Get Chat History
const getMessages = async (req, res) => {
    try {
        const { userId } = req.params;

        const messages = await Message.find({
            $or: [
                { sender: req.user._id, receiver: userId },
                { sender: userId, receiver: req.user._id },
            ],
        }).sort({ createdAt: 1 });

        res.status(200).json(messages);

    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

// Mark Delivered
const markDelivered = async (req, res) => {
    try {
        const message = await Message.findByIdAndUpdate(
            req.params.messageId,
            { delivered: true },
            { new: true }
        );

        if (!message) {
            return res.status(404).json({
                message: "Message not found",
            });
        }

        const senderSocket = getReceiverSocket(message.sender.toString());

        if (senderSocket) {
            getIO().to(senderSocket).emit("messageDelivered", message);
        }

        res.json(message);

    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

// Mark Seen
const markSeen = async (req, res) => {
    console.log("💜 markSeen called");

    try {
        const message = await Message.findByIdAndUpdate(
            req.params.messageId,
            {
                delivered: true,
                seen: true,
            },
            { new: true }
        );

        if (!message) {
            return res.status(404).json({
                message: "Message not found",
            });
        }

        console.log("Message:", message);

        const senderSocket = getReceiverSocket(message.sender.toString());

        console.log("Sender Socket:", senderSocket);

        if (senderSocket) {
            console.log("📤 Emitting messageSeen");

            getIO().to(senderSocket).emit("messageSeen", message);
        }

        res.json(message);

    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};
const deleteMessage = async (req, res) => {
    try {
        const message = await Message.findById(req.params.messageId);

        if (!message) {
            return res.status(404).json({
                message: "Message not found",
            });
        }

        // Only the sender can delete the message
        if (message.sender.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                message: "Not authorized",
            });
        }

        await Message.findByIdAndDelete(req.params.messageId);

        const receiverSocketId = getReceiverSocket(message.receiver.toString());

        console.log("Receiver:", message.receiver.toString());
        console.log("Receiver Socket:", receiverSocketId);

        if (receiverSocketId) {
            console.log("📤 Emitting messageDeleted");

            getIO().to(receiverSocketId).emit("messageDeleted", {
                messageId: message._id,
            });
        }

        res.status(200).json({
            message: "Message deleted successfully",
        });

    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};
module.exports = {
    sendMessage,
    getMessages,
    markDelivered,
    markSeen,
    deleteMessage,
};