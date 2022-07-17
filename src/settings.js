const { Logger, LOG_LEVEL } = require('./utils/log');

let PASSWORD = "hax-cytube";

const ROOM = "CyTube /haxb/";

const PUBLIC_ROOM = true;

const MAX_PLAYERS = 12;

const GEOCODE = undefined;

const SCORE_LIMIT = 8; // goals to win the game, 0 for infinite
const TIME_LIMIT = 0; // max minutes per game, 0 for infinite
const TEAMS_LOCK = false; // block players from joining teams manually?

const DEFAULT_STADIUM = "Classic";

const CYTUBE_URL = "https://cytu.be/r/haxb";

const LOG = new Logger(LOG_LEVEL.INFO);

const ADMINS = new Set([
  'vI7tm0KUTB-rwz5nPorf47_ZTUarz8kX4EMC-a0RmbU', // kslar
  'tDvju5PPtZgleuldQgT7tTRvZzekP14VYEWxgnEvW5Y', // rat
  '5p99drY0rORCZSX8x3ghFXkO42u1V-QDj3QSiOPeYZ0', // rat
]);

function getPassword() {
  return PASSWORD;
}

function setPassword(room, password = null) {
  if (password === 'open') {
    password = null;
  }

  PASSWORD = password;

  room.setPassword(PASSWORD);

  return PASSWORD;
}

module.exports = {
  LOG,
  ROOM,
  PUBLIC_ROOM,
  MAX_PLAYERS,
  GEOCODE,
  SCORE_LIMIT,
  TIME_LIMIT,
  TEAMS_LOCK,
  DEFAULT_STADIUM,
  CYTUBE_URL,
  ADMINS,
  getPassword,
  setPassword,
};
