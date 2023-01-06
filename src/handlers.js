const { WORD_SPLIT_REGEX } = require('./utils/strings');

const { LOG, CYTUBE_URL, getPassword, setPassword } = require('./settings');

const { COLOR, getRoom, info, warn, checkAdmin, isSuperAdmin, setAuth, resetAuth, displayError } = require('./lib');

const WITH_PASSWORD = '&p=1';

function onRoomLink(url) {
  if (url.endsWith(WITH_PASSWORD)) {
    url = url.substring(0, url.length - WITH_PASSWORD.length);
  }

  LOG.info('👉', url, passwordInfo());
}

function passwordInfo() {
  const PASSWORD = getPassword();
  return PASSWORD ? `🔐 ${PASSWORD}` : '🔓';
}

function cytubeInfo(player) {
  info("💬🎧 Chat & DJ at " + CYTUBE_URL, player);
}

function onPlayerJoin(player) {
  LOG.info(`onPlayerJoin: ${player.name} (${player.auth})`);

  setAuth(player);
  checkAdmin(player);

  cytubeInfo(player);
}

function onPlayerLeave(player) {
  LOG.info(`onPlayerLeave: ${player.name}`);

  resetAuth(player);
}

function onStadiumChange(stadium, byPlayer) {
  if (byPlayer) {
    LOG.info(`onStadiumChange: '${stadium}' by ${byPlayer.name}`);
  }
}

function onPlayerChat(player, msg) {
  if (msg.startsWith('!')) {
    processCommand(player, msg);
    return false;
  } else {
    LOG.debug(`${player.name}: ${msg}`);
  }
}

const ADMIN_HELP = [
  "🧹 !clearbans ▶️ Reset all current bans so banned people can join again to the room.",
  "🔐 !password ▶️ See the room password."
].join('\n');

const SUPERADMIN_HELP = [
  "🔐 !password [new] ▶️ Change the room password. Use !password open to clear the password and open the room.",
].join('\n');

function password(player, args) {
  const newPassword = args.length > 0 && args[0];
  const changePassword = newPassword && isSuperAdmin(player);

  if (newPassword) {
    if (changePassword) {
      setPassword(getRoom(), newPassword);
    } else {
      adminOnlyCallback(player);
    }
  }

  if (!newPassword || changePassword) {
    info(passwordInfo(), player, COLOR.SUCCESS, 'normal', changePassword ? LOG.info : LOG.debug);
  }
}

function clearBans(player) {
  getRoom().clearBans();

  info("🧹 List of banned players has been cleared.", player, COLOR.SUCCESS);
}

function adminOnly(callback) {
  return (player, args) => adminOnlyCallback(player, args, callback);
}

function adminOnlyCallback(player, args, callback) {
  if (typeof callback === 'function' && (player.admin || isSuperAdmin(player))) {
    callback(player, args);
    return;
  }
  warn("🚫 Sorry, you do not have permissions to execute this command.", player);
}

function help(player) {
  if (player.admin) {
    let adminHelp = '⚜️ ADMIN ⚜️\n' + ADMIN_HELP;

    if (isSuperAdmin(player)) {
      adminHelp += '\n' + SUPERADMIN_HELP;
    }

    info(adminHelp, player, COLOR.DEFAULT);
  } else {
    cytubeInfo(player);
  }
}

const COMMAND_HANDLERS = {
  'help': help,
  'password': password,
  'clear_bans': adminOnly(clearBans),
  'clearbans': adminOnly(clearBans),
};

async function processCommand(player, msg) {
  msg = msg.slice(1); // trim !
  let args = msg.split(WORD_SPLIT_REGEX).filter(arg => arg.length > 0); // split & trim spaces

  let valid = false;

  if (args.length > 0) {
    const command = args[0].toLowerCase();
    args.splice(0, 1); // remove command from args

    LOG.info(`${player.name} -> !${command} ${args.join(' ')}`);

    if (command in COMMAND_HANDLERS) {
      try {
        await COMMAND_HANDLERS[command](player, args, command);
      } catch (error) {
        displayError("Cannot process command", error, player);
      }
      valid = true;
    }
  }

  if (!valid) {
    info("Invalid command. Use !help for more information", player, COLOR.ERROR);
  }
}

module.exports = {
  onRoomLink,
  onPlayerJoin,
  onPlayerLeave,
  onStadiumChange,
  onPlayerChat,
};
