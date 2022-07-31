const { LOG, PUBLIC_ROOM, ADMINS, getPassword } = require('./settings');

/** @type {import("haxball-types").Room} */
let room;

/* HaxBall Constants */

const NOTIFY = 2; // notification sound id

/* Chat Messages */

const COLOR = {
  WHITE: 0xffffff,
  RED: 0xe56e56,
  BLUE: 0x5689e5,
  YELLOW: 0xffffe4,
  GREEN: 0xc4ff65,
  WARNING: 0xffa135,
  ERROR: 0xa40000,
  SUCCESS: 0x75ff75,
  INFO: 0xbebebe,
  NOTIFY: 0xffefd6,
  DEFAULT: 0xffc933
};

function sendAnnouncement(msg, targetId, color, style, sound, log = LOG.debug) {
  if (typeof msg === 'string' && msg.trim().length > 0) {
    if (typeof log === 'function') {
      log(msg);
    }
    room.sendAnnouncement(msg, targetId, color, style, sound);
  }
}

function send(msg, targetPlayer = null, color = COLOR.DEFAULT, style = 'normal', sound = 1, log = LOG.debug) {
  let targetId = null;

  if (targetPlayer !== null) {
    if (typeof targetPlayer === 'number') {
      targetId = targetPlayer;
    } else if (typeof targetPlayer === 'object') {
      targetId = targetPlayer.id;
    }
  }

  if (typeof msg === 'string') {
    sendAnnouncement(msg, targetId, color, style, sound, log);
  } else if (msg instanceof Array && msg.length > 0) {
    sendAnnouncement(msg[0], targetId, color, style, sound, log);

    for (let line of msg.slice(1)) {
      sendAnnouncement(line, targetId, color, style, 0, log);
    }
  }
}

function notify(msg, color = COLOR.NOTIFY, style = 'bold', sound = NOTIFY, log = LOG.info) {
  send(msg, null, color, style, sound, log);
}

function info(msg, targetPlayer = null, color = COLOR.INFO, style = 'normal', log = LOG.debug) {
  send(msg, targetPlayer, color, style, 1, log);
}

function warn(msg, targetPlayer = null, sound = 1, style = 'normal', color = COLOR.WARNING, log = LOG.debug) {
  send(msg, targetPlayer, color, style, sound, log);
}

function error(msg, targetPlayer = null, log = LOG.debug) {
  send(msg, targetPlayer, COLOR.ERROR, 'italic', 1, log);
}

function displayError(context, e, player = null) {
  LOG.error(context, e);

  if (player) {
    error(`${context}` + (player.admin && e ? `: ${e}` : ''), player);
  }
}

/* Authentication */

const AUTH = {}; // player id to auth

function setAuth(player) {
  AUTH[player.id] = player.auth;
}

function getAuth(player) {
  return AUTH[player.id];
}

function resetAuth(player) {
  delete AUTH[getAuth(player)];
}

function isAdmin(player) {
  const allAdmins = !PUBLIC_ROOM && getPassword();

  if (allAdmins || room.getPlayerList().length === 1) {
    return true;
  }

  const auth = typeof player === 'object' ? getAuth(player) : player;

  return ADMINS.has(auth);
}

function checkAdmin(player) {
  if (isAdmin(player)) {
    room.setPlayerAdmin(player.id, true);
  }
}

module.exports = {
  NOTIFY,
  COLOR,
  notify,
  info,
  warn,
  error,
  setAuth,
  getAuth,
  resetAuth,
  checkAdmin,
  displayError,
  getRoom: () => room,
  injectRoom: (r) => {
    room = r;
  },
};
