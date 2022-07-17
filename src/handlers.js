const { LOG, CYTUBE_URL, PASSWORD } = require('./settings');

const { info, checkAdmin, setAuth, resetAuth } = require('./lib');

function onRoomLink(url) {
  LOG.info('👉', url);

  if (PASSWORD) {
    LOG.info('🔐', PASSWORD);
  }
}

function onPlayerJoin(player) {
  LOG.info(`onPlayerJoin: ${player.name} (${player.auth})`);

  setAuth(player);
  checkAdmin(player);

  info("💬🎧 Chat & DJ at " + CYTUBE_URL, player);
}

function onPlayerLeave(player) {
  LOG.info(`onPlayerLeave: ${player.name}`);

  resetAuth(player);
}

function onStadiumChange(stadium, byPlayer) {
  if (byPlayer) {
    LOG.info(`onStadiumChange: '${stadium}' by ${byPlayer}`);
  }
}

function onPlayerChat(player, msg) {
  LOG.debug(`${player.name}: ${msg}`);
}

module.exports = {
  onRoomLink,
  onPlayerJoin,
  onPlayerLeave,
  onStadiumChange,
  onPlayerChat,
};
