require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const port = 2222;
app.use(express.json());
app.use(cors());
require("./db/database");
const colors = require("colors");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const users = [
  { id: 1, private_Key: process.env.user1_prvKey },
  { id: 2, private_Key: process.env.user2_prvKey },
  { id: 3, private_Key: process.env.user3_prvKey },
  // { id: 4, private_Key: process.env.user4_prvKey },
];

const http = require("http");
const server = http.createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000",
  },
});

const SetTime = require("./models/settime.model");
const errorModel = require("./models/errorModel.model");

//? MOST VALUABLE FILES💖
const MainBuy = require("./MainBuy");
const MainSell = require("./MainSell");
const priceFetchForBuy = require("./fetchSelling");
const ErrorModel = require("./models/errorModel.model");
const userModel = require("./models/user.model");
const UserModel = require("./models/user.model");

let isBotRunning = false;
let stopExecution = false;
let currentAction = "buy";
let currentIndex = 0;
const lastUserIndex = users.length - 1;

//TODO:__RANDOM NAUMBER GENRATER
function randomNumber(min, max) {
  const delayNumber = Math.floor(Math.random() * (max - min + 1)) + min;
  const delay = delayNumber * 1000 * 60;
  return delay;
}
//TODO:- Dollar Random 
// const generateRandomNumberForDollar = (min, max) => {
//   return Math.floor(Math.random() * (max - min + 1)) + min;
// };

const generateRandomNumberForDollar = (min, max, decimalPlaces) => {
  const factor = Math.pow(10, decimalPlaces);
  const randomNum = Math.random() * (max - min) + min;
  return Math.floor(randomNum * factor) / factor;
};

//TODO:-  IO MIDDLEWARE
app.use("/api", (req, res, next) => {
  req.io = io;
  next();
});

//TODO - forNextAction FOR BUY / SELL Repeatly
async function forNextAction() {
  if (stopExecution) return;
  console.log(
    colors.bgBrightMagenta(
      `I am INSIDE forNextAction Function"  currentAction:- ${currentAction},currentIndex:- ${currentIndex},`
    )
  );
  // UserDetails:- ${JSON.stringify(users[currentIndex].userId,)}
  try {
    const setTimeData = await SetTime.findOne({});
    if (!setTimeData) {
      throw new Error("User Not seted any paramters")
      // console.log("No time data found in the database");
      // return false;
    }
    const { firstTime, lastTime, } = setTimeData;
    // console.log(firstTime,lastTime,dollarEnd,dollarStart,"firstTime, lastTime, dollarEnd,dollarStart"
    // );
    const randomDelay = randomNumber(firstTime, lastTime);
    console.log(randomDelay, "Delay time for next transtion :)");

    await new Promise((resolve) => setTimeout(resolve, randomDelay));
    performActionAfterInterval();
  } catch (error) {
    throw new Error("error While getting time from Database")
    // console.error("Error fetching time data:", error);
    // return res.status(500).json({
    //   message: "Internal Error Plesae Contact",
    // });
  }
}

const AdminSet = async (req, res) => {
  try {
    const setTimeData = await SetTime.findOne({});
    if (!setTimeData) {
      // console.log("No time data found in the database");
     throw new Error("Admin never seted any value");
    }
    const { dollarEnd, dollarStart, decimalPlaces } = setTimeData;
    // console.log(dollarEnd, dollarStart, "dollarEnd, dollarStart");
    const randomDelay = await generateRandomNumberForDollar(
      dollarEnd,
      dollarStart,
      decimalPlaces
    );
    return randomDelay;
  } catch (error) {
    // console.error("Error fetching time data:", error);
    throw new Error("Error fetching time data:")
  }
};

//TODO:- FIRST INITIAL FUNCTION CALL
async function initialBuy() {
  console.log(
    colors.bgBrightBlue(
      `"Initial Buy"  currentAction:- ${currentAction},currentIndex:- ${currentIndex}, `
    )
  );
  if (stopExecution) return;
  try {
    const randomUsdtDollar = await AdminSet();
    await MainBuy(users[currentIndex], randomUsdtDollar);
    currentIndex++;
    currentAction = "sell";
    console.log(
      colors.bgGreen(
        `"Initial Buy SUCESS" currentAction:- ${currentAction},currentIndex:- ${currentIndex},`
      )
    );
    // UserId:- ${JSON.stringify(users[currentIndex])}
    await forNextAction();
  } catch (error) {
    io.emit("deskError", { data: error.message });
    const userId = currentIndex + 1;
    const addError = new ErrorModel({
      userId: userId,
      accountAddress: error.message,
      errorAction: currentAction,
    });
    const data = await addError.save();
    console.log(data, "data");
    currentIndex++;
    currentAction = "buy";
    console.log(
      colors.bgRed(
        `"Initial Buy ERROR"  currentAction:- ${currentAction},currentIndex:- ${currentIndex}}`
      )
    );
    await forNextAction();
  }
}

const performActionAfterInterval = async () => {
  // console.log("inside performActionAfterInterval function".rainbow);
  if (stopExecution) return;
  const user = users[currentIndex];
  if (currentAction === "buy") {
    try {
      const randomUsdtDollar = await AdminSet();
      // console.log(
      //   randomUsdtDollar,
      //   typeof randomUsdtDollar,
      //   "randomUsdtDollar"
      // );

      await MainBuy(users[currentIndex], randomUsdtDollar);
      currentAction = "sell";
    } catch (error) {
      io.emit("deskError", { data: error.message });
      const userId = currentIndex + 1;

      const addError = new ErrorModel({
        userId: userId,
        accountAddress: error.message,
        errorAction: currentAction,
      });
      const data = await addError.save();
      console.log(data, "data");
      currentAction = "buy";
    }
  } else {
    console.log("Sell Function process....");
    try {
      const randomUsdtDollar = await AdminSet();
      const sellDeodPrice = await priceFetchForBuy(randomUsdtDollar);
      // console.log(sellDeodPrice, "Mai sell price");
      await MainSell(users[currentIndex], sellDeodPrice);
      currentAction = "buy";

      // console.log(sellDeodPrice, typeof sellDeodPrice, "Sell Deod Price --sh");
      // throw new Error("Error In FIRST SEll")
    } catch (error) {
      // console.log(error.message, "Error in sell where");
      io.emit("deskError", { data: error.message });
      const userId = currentIndex + 1;
      const addError = new ErrorModel({
        userId: userId,
        accountAddress: error.message,
        errorAction: currentAction,
      });
      const data = await addError.save();
      console.log(data, "data");
      currentAction = "sell";

      // process.exit()
      // io.emit("assetPurchased", { data: await NotificationCount() });
    }
  }
  currentIndex++;
  console.log(
    colors.bgBrightCyan(
      `Checking CurrentIndex and CurrentAction,
      currentIndex: ${currentIndex},
      currentAction: ${currentAction},
      `
      // UserId:- ${JSON.stringify(users[currentIndex])}
    )
  );

  if (currentIndex <= lastUserIndex) {
    // console.log("LIMIT USER");
    await forNextAction();
  } else {
    currentIndex = 0;
    // console.log("STARTING USER");
    await forNextAction();
  }
};

app.post("/api/startBot", (req, res) => {
  if (!isBotRunning) {
    isBotRunning = true;
    stopExecution = false;
    // console.log("Bot started successfully");
    initialBuy();
    return res.status(200).json({
      status: true,
      message: "Bot started successfully",
    });
  } else {
    return res.status(400).json({
      status: false,
      message: "Bot is already running",
    });
  }
});

app.post("/api/stopBot", (req, res) => {       
  if (isBotRunning) {
    isBotRunning = false;
    stopExecution = true;
    // currentIndex = 0;
    // currentAction="buy";
    return res.status(200).json({
      status: true,
      message: "Bot stopped successfully",
    });
  } else {
    return res.status(400).json({
      status: false,
      message: "Bot is not running",
    });
  }
});

app.get("/api/checkBotStatus", (req, res) => {
  return res.json({ status: isBotRunning });
});


app.get("/getCount",async (req, res) => {
  const getCount = await errorModel.find({})
  // console.log(getCount, "getCount");
  return res.status(200).json({
    data:getCount
  })
})


app.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    // Check if user already exists
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user
    const newUser = new UserModel({
      username,
      email,
      password: hashedPassword,
    });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });// console.log(user, "user");
    
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const key = process.env.tokenKey;

    // Generate token
    const token = jwt.sign({ userId: user._id }, key, { expiresIn: '1y' });
    // console.log(user.email, "isMatch.userId ");
   return  res.status(200).json({ token:token, email: user.email});
  } catch (error) {
    // console.error('Error logging in:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/api/notification', async (req, res) => {
  try {
    const errors = await ErrorModel.find();
    res.status(200).json(errors);
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err });
  }
});


app.get('/api/validate-token', (req, res) => {
  const token = req.headers['authorization']?.split(' ')[1];
  // console.log(token, "Toke");
  if (!token) {
    return res.status(401).json({ message: 'Token missing' });
  }

  try {
    const key = process.env.tokenKey;
    jwt.verify(token, key);
    res.json({ message: 'Token is valid' });
  } catch (err) {
    res.status(401).json({ message: 'Token is invalid or expired', error: err });
  }
});

app.delete('/api/notification', async (req, res) => {
  try {
    await ErrorModel.deleteMany({});
    res.status(200).json({ message: 'All notifications deleted successfully' });
  } catch (error) {
    console.error('Error deleting notifications:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.get("/api/getAllparameters", async (req, res) => {
  try {
    const parameters = await SetTime.find();
    return res.status(200).json({message:"setted parameters",parameters})
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
});



server.listen(port, () =>
  console.log(`Example app listening on port ${port}!`)
);

io.on("connection", (socket) => {
  // console.log("a user connected node");

  socket.on("disconnect", function () {
    // console.log("A user disconnected");
  });
});



