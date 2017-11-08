'use strict';

let flag = false;

module.exports = mongoose => {
  let model;
  if (!flag) {
    const PermissionSchema = new mongoose.Schema({
      name: { type: String },
      alias: { type: String },
    });

    flag = true;
    model = mongoose.model('Permission', PermissionSchema);
  } else {
    model = mongoose.model('Permission');
  }

  return model;
};
