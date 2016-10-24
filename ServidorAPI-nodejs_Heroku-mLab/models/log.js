var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var logSchema = new Schema({ 
 arduino_id: { type: String },
 valor: { type: String },
 datetime: { type: String }
});

module.exports = mongoose.model('Log', logSchema);