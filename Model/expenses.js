const mongoose = require('mongoose');

const expensesSchema = mongoose.Schema({
    group: { type: mongoose.Schema.Types.ObjectId, ref: 'group' },
    type: { type: String, required: true},
    amount: {type: String, required: true},
    date: { type: String, required: true},
    img_url: {type: String},
    approved: {type: Boolean, default: false},
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'user' }
});
module.exports = mongoose.model('expense', expensesSchema);
