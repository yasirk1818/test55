function isLoggedIn(req, res, next) {
  if (!req.session.user) return res.redirect('/login');
  next();
}

function isAdmin(req, res, next) {
  if (!req.session.user || !req.session.user.isAdmin) {
    return res.status(403).send('Access denied');
  }
  next();
}

module.exports = { isLoggedIn, isAdmin };
