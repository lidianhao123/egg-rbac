'use strict';

module.exports = mongoose => {
  const Schema = mongoose.Schema;
  const ObjectId = Schema.ObjectId;
  const RoleSchema = new mongoose.Schema({
    name: { type: String },
    alias: { type: String },
    grants: [{ type: ObjectId, ref: 'Permission' }],
  });

  return mongoose.model('Role', RoleSchema);
};
