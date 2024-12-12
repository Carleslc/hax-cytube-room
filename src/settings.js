const { Logger, LOG_LEVEL } = require('./utils/log');

let PASSWORD = process.env.ROOM_PASSWORD || "hax-cytube";

const ROOM = process.env.ROOM || "CyTube /haxb/";

const PUBLIC_ROOM = true;

const MAX_PLAYERS = 16;

const GEOCODE = undefined;
// const GEOCODE = { code: 'de', lat: 50.1213479, lon: 8.4964822 }; // FRA1 (Frankfurt)

const SCORE_LIMIT = 8; // goals to win the game, 0 for infinite
const TIME_LIMIT = 0; // max minutes per game, 0 for infinite
const TEAMS_LOCK = false; // block players from joining teams manually?

const DEFAULT_STADIUM = "Classic";

const CYTUBE_URL = "https://cytu.be/r/haxb";

const LOG = new Logger(LOG_LEVEL.INFO);

const ADMINS = new Set([
  'e32kly4k7siLmAPyqwFRXAzygzf7RCTEsAPS3cvRMN8', // kslar
  '58CmWxJkh4MGWQ3X9yNCK4A0L6rIzHbAsYEnGqSrIoY', // cont
  'jp9_VMW5JufSdzKV3AEqxzNfAHUMo5YOhdLl5qml3_0', // rat
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
