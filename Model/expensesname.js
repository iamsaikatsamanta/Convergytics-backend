const mongoose = require('mongoose');

const expensesnameSchema = mongoose.Schema({
    name:  {type: String, required: true}
});
module.exports = mongoose.model('expensesname', expensesnameSchema);
