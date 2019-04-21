const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name:  {type: String, required: true},
    email: { type: String, required: true, unique: true},
    password: {type: String, required: true},
    img_url: {type: String},
    moderator: {type: Boolean, default: false},
    group: {type: mongoose.Schema.Types.ObjectId ,ref: 'group', default: null}
});
module.exports = mongoose.model('user', userSchema);
