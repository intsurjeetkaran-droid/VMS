/**
 * Winston Logger Configuration
 * - Logs to console in development
 * - Logs to files in all environments
 * - Captures: info, warn, error levels
 */
const { createLogger, format, transports } = require('winston');
const path = require('path');

const { combine, timestamp, printf, colorize, errors } = format;

// Custom log format: [timestamp] LEVEL: message { meta }
const logFormat = printf(({ level, message, timestamp, stack, ...meta }) => {
  const metaStr = Object.keys(meta).length ? JSON.stringify(meta) : '';
  return `[${timestamp}] ${level}: ${stack || message} ${metaStr}`;
});

const logger = createLogger({
  level: process.env.NODE_ENV === 'production' ? 'warn' : 'info',
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    errors({ stack: true }), // capture stack traces
    logFormat
  ),
  transports: [
    // All logs → app.log
    new transports.File({
      filename: path.join(__dirname, '../../logs/app.log'),
      maxsize: 5 * 1024 * 1024, // 5MB
      maxFiles: 5,
    }),
    // Error-only logs → error.log
    new transports.File({
      filename: path.join(__dirname, '../../logs/error.log'),
      level: 'error',
      maxsize: 5 * 1024 * 1024,
      maxFiles: 5,
    }),
  ],
});

// In development, also log to console with colors
if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new transports.Console({
      format: combine(colorize(), timestamp({ format: 'HH:mm:ss' }), logFormat),
    })
  );
}

module.exports = logger;
