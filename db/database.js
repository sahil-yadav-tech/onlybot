const mongoose = require('mongoose');
mongoose.set('strictQuery', true);
// # DATABASE_URI=mongodb+srv://SahilYadav:FRpXBwWfEZ7dulNu@cluster0.tn4ng8u.mongodb.net/Stake
const DB="mongodb://localhost:27017/Next"
// JWT_AUTH_KEY=SxFXrycYbutU5z2OjBOx2UzyNTDi3HyD
// const DB = process.env.database;

mongoose
  .connect(DB, {
  })
  .then(() => {
    console.log('Connection Succefully, JAI HANUMAN JI');
  })
  .catch((error) => {
    console.log(error);
  });
