const mongoose = require('mongoose');

const paymentSchema = mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'user'},
    expense : {type: mongoose.Schema.Types.ObjectId, ref: 'expense'},
    amount: {type: String, required: true},
    amountfromothers: {type: Number, default: 0},
    date: { type: String},
    status: {type: Boolean, default: false},
});
module.exports = mongoose.model('payment', paymentSchema);
