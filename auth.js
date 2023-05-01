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
  console.log("Session added for user: " + user + " with id: " + sessionId);
  return sessionId;
}

/*
 * This will check if the user has a session.
 * @param {String} user is the username of the user.
 * @param {Number} sessionId is the id of the session.
 * @returns {Boolean} True if the user has a session, otherwise false.
 */
function hasSession(user, sessionId) {
  console.log("Checking session");
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

/*
 * This will protect all of the html pages so that they cannot
 * be accessed without logging into the page first.
 */
function authenticatePages(app) {
  // checks if user has authority to log into the pages
  app.use("/help.html", authenticate);
  app.use("/index.html", authenticate);
  app.use("/predictions.html", authenticate);
  app.use("/profile.html", authenticate);
  app.use("/search.html", authenticate);
  // app.use("/", authenticate);
}

/*
 * This middleware will check if the user can be validated with cookies.
 * @param {Object} req is the information about the request.
 * @param {Object} res the response sent back to the user.
 * @param {Function} next is the function to be run if the cookie is valid.
 */
function authenticate(req, res, next) {
  // Check for cookies
  const curCookie = req.cookies;
  console.log(curCookie);

  // Verify the existence of cookies (e.g., "id" and "username")
  if (
    curCookie &&
    curCookie.login &&
    curCookie.login.sid &&
    curCookie.login.username
  ) {
    console.log(
      "Cookie found for user: " +
        curCookie.login.username +
        " with id: " +
        curCookie.login.sid
    );
    // Check if the cookie is valid (e.g., using a function like 'hasSession')
    const result = hasSession(curCookie.login.username, curCookie.login.sid);
    if (result) {
      next();
      return;
    }
  } else {
    console.log("No cookie found");
    // sends back to html
    res.redirect("/login.html");
  }
}

module.exports = {
  addSession,
  hasSession,
  cleanupSessions,
  authenticate,
  authenticatePages
};
