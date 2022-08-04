const winston = require("winston");
require("winston-daily-rotate-file");

const config = require("../config");

const logFormat = winston.format.printf(({ level, message, timestamp }) => {
    return `${timestamp}~#~${level}~#~${message}`;
});

module.exports = winston.createLogger({
    format: winston.format.combine(
        winston.format.timestamp({
            format: "YY-MM-DD HH:MM:SS",
        }),
        logFormat
    ),
    transports: [
        new winston.transports.DailyRotateFile({
            json: false,
            level: "info",
            filename: require("path").join(
                __dirname,
                "../" + config.logging.logger_dir,
                "info-%DATE%.log"
            ),
            datePattern: "DD-MM-YYYY",
            maxFiles: config.logging.maxfiles,
            auditFile:
                __dirname +
                "../" +
                config.logging.logger_dir +
                "/info.audit.json",
        }),

        new winston.transports.DailyRotateFile({
            json: false,
            level: "error",
            filename: require("path").join(
                __dirname,
                "../" + config.logging.logger_dir,
                "debug-%DATE%.log"
            ),
            datePattern: "DD-MM-YYYY",
            maxFiles: config.logging.maxfiles,
            auditFile:
                __dirname +
                "../" +
                config.logging.logger_dir +
                "/debug.audit.json",
        }),
    ],
});
