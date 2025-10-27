const db = require('../config/db');

module.exports = {
  User: require('./User')(db),
  Load: require('./Load')(db),
  Message: require('./Message')(db),
  AccessControl: require('./AccessControl')(db),
};
