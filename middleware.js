// middleware.js

const { sessions, SESSION_LENGTH } = require('./server');

function authenticate(req, res, next) {
  // Check for cookies
  let curCookie = req.cookies;
  console.log(curCookie);

  // Verify the existence of cookies (e.g. "id" and "username")
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
    // This function should be implemented to look up the session in your database
    var result = hasSession(curCookie.login.username, curCookie.login.sid);
    if (result) {
      next();
      return;
    }
  }
  else {
    console.log("No cookie found");
    // sends back to html
    res.redirect("/login.html");
  }
}

function hasSession(user, sessionId) {
  console.log("checking session");
  if (sessions[user] && sessions[user].sid == sessionId) {
    return true;
  }
  return false;
}

function addSession(user) {
  let sessionId = Math.floor(Math.random() * 100000);
  let sessionStart = Date.now();
  sessions[user] = { sid: sessionId, start: sessionStart };
  console.log("Session added for user: " + user + " with id: " + sessionId);
  return sessionId;
}

function cleanupSessions() {
  let now = Date.now();
  for (let user in sessions) {
    let session = sessions[user];
    if (session.start + SESSION_LENGTH < Date.now()) {
      delete sessions[user];
    }
  }
}

module.exports = {
  authenticate,
  hasSession,
  addSession,
  cleanupSessions,
};
