// Logging

const LOG_LEVEL = {
  DEBUG: 1,
  INFO: 2,
  WARN: 3,
  ERROR: 4
};

const CONSOLE_LOG = {
  DEBUG: console.debug,
  INFO: console.info,
  DIR: console.dir,
  LOG: console.log,
  WARN: console.warn,
  ERROR: console.error
};

const NO_LOG = (_) => {};

class Logger {
  constructor(level = LOG_LEVEL.INFO) {
    this.level = level;
  }
  get level() {
    return this._level;
  }
  set level(value) {
    console.error = value > LOG_LEVEL.ERROR ? NO_LOG : CONSOLE_LOG.ERROR;
    console.warn = value > LOG_LEVEL.WARNING ? NO_LOG : CONSOLE_LOG.WARNING;

    if (value > LOG_LEVEL.INFO) {
      console.info = NO_LOG;
      console.log = NO_LOG;
      console.dir = NO_LOG;
    } else {
      console.info = CONSOLE_LOG.INFO;
      console.log = CONSOLE_LOG.LOG;
      console.dir = CONSOLE_LOG.DIR;
    }
    
    console.debug = value > LOG_LEVEL.DEBUG ? NO_LOG : CONSOLE_LOG.DEBUG;
  }
  canLog(level) {
    return (level || this.level) <= this.level;
  }
  info(...msg) {
    console.info(...msg);
  }
  log(...msg) {
    console.log(...msg);
  }
  debug(...msg) {
    console.debug(...msg);
  }
  warn(...msg) {
    console.warn('⚠️', ...msg);
  }
  error(...msg) {
    console.error('❌', ...msg);
  }
}

module.exports = {
  LOG_LEVEL,
  Logger,
};
