const mongoose = require('mongoose');
const config = require('./../../config')
mongoose.set('debug', true);
mongoose.Promise = Promise;
mongoose.connect(config.mongodbUri || "mongodb://localhost:27017/linebot-truth-or-dare", {
  keepAlive: true,
  useNewUrlParser: true
});

module.exports = {
  TrGroup: require('./trGroup'),
  TrGroupMember: require('./trGroupMember')
}