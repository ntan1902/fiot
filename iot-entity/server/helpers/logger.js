const winston = require("winston");

const logConfiguration = {
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({
      level: "error",
      // Create the log directory if it does not exist
      filename: "logs/iot_entity_error.log",
    }),
  ],
  format: winston.format.combine(
    winston.format.label({
      label: `IOT_Entity 🏷️:`,
    }),
    winston.format.timestamp({
      format: "MMM-DD-YYYY HH:mm:ss",
    }),
    winston.format.colorize(),
    winston.format.printf(
      (info) =>
        `${info.level}: ${info.label}: ${[info.timestamp]}: ${info.message}`
    )
  ),
};

const logger = winston.createLogger(logConfiguration);

module.exports = logger;
