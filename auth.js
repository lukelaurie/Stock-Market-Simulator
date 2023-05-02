const bcrypt = require("bcrypt");

const sessions = {};
// Set session length to 10 minutes
const SESSION_LENGTH = 1000 * 60 * 10;

setInterval(cleanupSessions, 2000);

/*
 * This will add a session for the user to the sessions object.
 * @param {String} user is the username of the user.
 * @returns {Number} sessionId is the id of the session.
 */
function addSession(user) {
  const sessionId = Math.floor(Math.random() * 100000);
  const sessionStart = Date.now();
  sessions[user] = { sid: sessionId, start: sessionStart };
  return sessionId;
}

/*
 * This will check if the user has a session.
 * @param {String} user is the username of the user.
 * @param {Number} sessionId is the id of the session.
 * @returns {Boolean} True if the user has a session, otherwise false.
 */
function hasSession(user, sessionId) {
  if (sessions[user] && sessions[user].sid === sessionId) {
    return true;
  }
  return false;
}

/*
 * This will remove a session for the user from the sessions object.
 */
function cleanupSessions() {
  const now = Date.now();
  for (const user in sessions) {
    const session = sessions[user];
    if (session.start + SESSION_LENGTH < now) {
      delete sessions[user];
    }
  }
}

module.exports = {
  addSession,
  hasSession,
  cleanupSessions
};
