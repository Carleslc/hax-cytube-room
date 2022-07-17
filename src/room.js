const HaxballJS = require('haxball.js');

const settings = require('./settings');

const { injectRoom } = require('./lib');

const { LOG, getPassword } = settings;

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
      geo: settings.GEOCODE,
      password: getPassword(),
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
    throw new Error("Missing TOKEN environment variable\nhttps://www.haxball.com/headlesstoken");
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
  HaxballJS.then(init).catch(e => LOG.error(e.message));
} catch (e) {
  LOG.error(e);
}
