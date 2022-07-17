const ROOM = "CyTube /haxb/";

const PUBLIC_ROOM = false;

const MAX_PLAYERS = 12;
const PASSWORD = "hax-cytube";
const GEOCODE = undefined;

const SCORE_LIMIT = 8; // goals to win the game, 0 for infinite
const TIME_LIMIT = 0; // max minutes per game, 0 for infinite
const TEAMS_LOCK = false; // block players from joining teams manually?

const DEFAULT_STADIUM = "Classic";

const ADMINS = new Set([
  'vI7tm0KUTB-rwz5nPorf47_ZTUarz8kX4EMC-a0RmbU', // kslar
  'tDvju5PPtZgleuldQgT7tTRvZzekP14VYEWxgnEvW5Y', // rat
]);

const CYTUBE_URL = "https://cytu.be/r/haxb";

const { Logger, LOG_LEVEL } = require("./utils/log");

const LOG = new Logger(LOG_LEVEL.INFO);

module.exports = {
  ROOM,
  PUBLIC_ROOM,
  MAX_PLAYERS,
  PASSWORD,
  GEOCODE,
  SCORE_LIMIT,
  TIME_LIMIT,
  TEAMS_LOCK,
  DEFAULT_STADIUM,
  ADMINS,
  CYTUBE_URL,
  LOG,
};
