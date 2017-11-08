'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const UserSchema = new mongoose.Schema({
    name: { type: String },
    pass: { type: String },

    create_at: { type: Date, default: Date.now },
    update_at: { type: Date, default: Date.now },

    accessToken: { type: String },
  });

  return mongoose.model('User', UserSchema);
};
