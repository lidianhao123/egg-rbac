'use strict';

module.exports = mongoose => {

  const PermissionSchema = new mongoose.Schema({
    name: { type: String },
    alias: { type: String },
  });

  return mongoose.model('Permission', PermissionSchema);
};
