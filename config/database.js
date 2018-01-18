if (process.env.NODE_ENV == 'production') {
  module.exports = {
    mongoURI: 'mongodb://anoteapp:4n0TEA99()@ds261917.mlab.com:61917/a-note-production'
  };
} else {
  module.exports = {
    mongoURI: 'mongodb://localhost/a-note-dev'
  };
}
