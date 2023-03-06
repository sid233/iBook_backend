const mongoose = require('mongoose');
const { Schema } = mongoose;

const NotesSchema = new Schema({
    user:{     //like a foreign key i.e. taking user id from User.js
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'  //refernce model i.e. from User.js
    },


    title:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true, 
    },
    tag:{
        type: String,
        default: "General"
    },
    date:{
        type: Date,
        default: Date.now
    },
  });
  module.exports = mongoose.model('notes', NotesSchema);