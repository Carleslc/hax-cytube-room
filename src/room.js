const HaxballJS = require("haxball.js");

const settings = require('./settings');

const { LOG } = settings;

const { injectRoom } = require('./lib');

/** @type {import("haxball-types").Room} */
let room;

async function init(HBInit) {
  checkToken();

  if (room === undefined) {
    room = await HBInit({
      // https://www.haxball.com/headlesstoken
      token: process.env.TOKEN,
      roomName: settings.ROOM,
      maxPlayers: settings.MAX_PLAYERS,
      public: settings.PUBLIC_ROOM,
      password: settings.PASSWORD,
      geo: settings.GEOCODE,
      noPlayer: true
    });
  }

  setRoomHandlers(room);

  room.setScoreLimit(settings.SCORE_LIMIT);
  room.setTimeLimit(settings.TIME_LIMIT);
  room.setTeamsLock(settings.TEAMS_LOCK);

  room.setDefaultStadium(settings.DEFAULT_STADIUM);

  injectRoom(room);

  LOG.info('✅ Room loaded');
}

function checkToken() {
  if (!process.env.TOKEN) {
    LOG.error("❌ Missing TOKEN environment variable\nhttps://www.haxball.com/headlesstoken");
    process.exit(1);
  }
}

const HANDLERS = require('./handlers');

function setRoomHandlers(room) {
  for (const handler of Object.keys(HANDLERS)) {
    room[handler] = (...args) => {
      try {
        return HANDLERS[handler](...args);
      } catch (e) {
        LOG.error(e);
      }
    };
  }
}

// Start room
try {
  HaxballJS.then(init).catch(LOG.error);
} catch (e) {
  LOG.error(e);
}
