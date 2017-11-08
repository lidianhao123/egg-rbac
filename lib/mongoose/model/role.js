'use strict';

let flag = false;

module.exports = mongoose => {
  let model;
  if (!flag) {
    const Schema = mongoose.Schema;
    const ObjectId = Schema.ObjectId;
    const RoleSchema = new mongoose.Schema({
      name: { type: String },
      alias: { type: String },
      grants: [{ type: ObjectId, ref: 'Permission' }],
    });

    model = mongoose.model('Role', RoleSchema);
    flag = true;
  } else {
    model = mongoose.model('Role');
  }
  return model;
};
