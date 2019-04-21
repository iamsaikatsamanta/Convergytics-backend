const mongoose = require('mongoose');

const groupSchema = mongoose.Schema({
    name:  {type: String, required: true},
    members: [{type: mongoose.Schema.Types.ObjectId, ref: 'user'}],
    moderator: {type: mongoose.Schema.Types.ObjectId, ref: 'user'}
});
module.exports = mongoose.model('group', groupSchema);
