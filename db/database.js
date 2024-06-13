const mongoose = require('mongoose');
mongoose.set('strictQuery', true);
// const DB="mongodb://localhost:27017/Next"
const DB = process.env.database;
mongoose
  .connect(DB, {
  })
  .then(() => {
    console.log('Connection Succefully, JAI HANUMAN JI');
  })
  .catch((error) => {
    console.log(error);
  });
