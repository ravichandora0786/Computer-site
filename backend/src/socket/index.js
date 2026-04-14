import { ChatEventEnum } from "../utils/constants/index.js";
import logger from "../utils/logger.js";

const initializeSocketIO = (io) => {
  return io.on("connection", async (socket) => {
    try {
      logger.info("A user connected: " + socket.id);

      socket.on("disconnect", () => {
        logger.info("User disconnected: " + socket.id);
      });
    } catch (error) {
      logger.error("Socket error: " + error.message);
    }
  });
};

const emitSocketEvent = (req, event, payload) => {
  const io = req.app.get("io");
  if (!io) return console.log("Socket IO not found");
  io.emit(event, payload);
};

export { initializeSocketIO, emitSocketEvent };
