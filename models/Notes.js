const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema

const NoteSchema = new Schema({
  title:{
    type: String,
    require:true
  },
  contents:{
    type: String,
    required: true
  },
  date:{
    type: Date,
    default: Date.now
  }
});

mongoose.model('notes', NoteSchema);
