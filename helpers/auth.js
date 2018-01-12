module.exports = {
  ensureAuthenticated: function(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    } else {
      req.flash('error_msg','Access Denied');
      res.redirect('/users/login');
    }
  }
};
