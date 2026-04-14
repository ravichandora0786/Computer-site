/**
 * Morgan Middleware for Logging HTTP Requests
 */

import morgan from "morgan";
import logger from "../utils/logger.js";

const morganFormat = ":method :url :status :response-time ms";

const morganMiddleware = morgan(morganFormat, {
  stream: {
    write: (message) => {
      const parts = message.trim().split(" ");
      const logObject = {
        method: parts[0],
        url: parts[1],
        status: parts[2],
        responseTime: parts[3],
      };
      logger.info(logObject);
    },
  },
});

export { morganMiddleware };
