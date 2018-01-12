module.exports = {
  ensureAuthenticated: function(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    } else {
      req.flash('error_msg','You Must Be Logged In To Access That Feature');
      res.redirect('/users/login');
    }
  }
};
