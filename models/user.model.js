const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;





// const mongoose = require("mongoose");
// const userschema = new mongoose.Schema({
//   userId: { type: Number, unique: true, required: true },
//   accountAddress: {
//     type: String,
//     required: true,
//   },
//   privateKey: {
//     type: String,
//     required: true,
//   },
// });
// const userModel = new mongoose.model("usermodel", userschema);
// module.exports = userModel;
