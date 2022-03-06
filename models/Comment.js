const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommentSchema = new Schema({

    user: {

        type: Schema.Types.ObjectId,
        ref: 'users'

    },

    name: {
        type: String,
        required: true
    },

    date: {
        type: Date,
        default: Date.now()
    },

    comments: [{
        type: Schema.Types.ObjectId,
        ref: 'comments'
    }]

});

module.exports = mongoose.model('comment', CommentSchema);