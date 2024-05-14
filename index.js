require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const port = 2222;
app.use(express.json());
app.use(cors());
require("./db/database");
const colors = require("colors");
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
const forBuy = require("./buy");
const forSell = require("./sell");
const Buy = require("./MainBuy");
const MainBuy = require("./MainBuy");
const { log } = require("console");
const MainSell = require("./MainSell");

let isBotRunning = false;
let stopExecution = false;
let currentAction = "buy";
let currentIndex = 0;
const lastUserIndex = users.length - 1;

//TODO:__RANDOM NAUMBER GENRATER
function randomNumber(min, max) {
  const delayNumber = Math.floor(Math.random() * (max - min + 1)) + min;
  const delay = delayNumber * 1000;
  return delay;
}
//TODO:-  IO MIDDLEWARE
app.use("/api", (req, res, next) => {
  req.io = io;
  next();
});

//TODO:- FIRST INITIAL FUNCTION CALL
async function initialBuy() {
  console.log(
    colors.bgBrightBlue(
      `"Initial Buy"  currentAction:- ${currentAction},currentIndex:- ${currentIndex}, UserId:- ${JSON.stringify(
        users[currentIndex]
      )}`
    )
  );
  if (stopExecution) return;
  try {
    // await forBuy(users[currentIndex]);
    await MainBuy(users[currentIndex], "0.5");
    // process.exit();
    console.log("buy");
    currentIndex++;
    currentAction = "sell";
    console.log(
      colors.bgGreen(
        `"Initial Buy SUCESS"  currentAction:- ${currentAction},currentIndex:- ${currentIndex}, UserId:- ${JSON.stringify(
          users[currentIndex]
        )}`
      )
    );
    await forNextAction();
  } catch (error) {
    currentIndex++;
    currentAction = "buy";
    console.log(
      colors.bgRed(
        `"Initial Buy ERROR"  currentAction:- ${currentAction},currentIndex:- ${currentIndex}, UserId:- ${users[currentIndex].id}`
      )
    );
    await forNextAction();
  }
}

async function forNextAction() {
  if (stopExecution) return;
  console.log(
    colors.bgBrightMagenta(
      `I am forNextAction Function"  currentAction:- ${currentAction},currentIndex:- ${currentIndex}, UserId:- ${JSON.stringify(
        users[currentIndex]
      )}`
    )
  );
  try {
    const setTimeData = await SetTime.findOne({});
    if (!setTimeData) {
      console.log("No time data found in the database");
      return false;
    }
    const { firstTime, lastTime, dollarEnd,dollarStart } = setTimeData;
    console.log(firstTime, lastTime, dollarEnd,dollarStart, "firstTime, lastTime, dollarEnd,dollarStart");
    process.exit()
    const randomDelay = randomNumber(2,5);
    console.log(randomDelay, "randomDelay randomDelay");
    await new Promise((resolve) => setTimeout(resolve, randomDelay));
    performActionAfterInterval();
  } catch (error) {
    console.error("Error fetching time data:", error);
    return res.status(500).json({
      message: "Internal Error Plesae Contact",
    });
  }
}
const performActionAfterInterval = async () => {
  console.log("inside performActionAfterInterval function".rainbow);

  if (stopExecution) return;
  const user = users[currentIndex];
  if (currentAction === "buy") {
    try {
      await MainBuy(users[currentIndex], "0.5");
      console.log("Buy");
      currentAction = "sell";
    } catch (error) {
      console.log(error.message, "error one ---------");
      currentAction = "buy";
      // io.emit("deskError", { data: "1" });
    }
  } else {
    try {
      console.log("sell s s s s s ss s s s ");
      await MainSell(users[currentIndex],6);
      process.exit();
      currentAction = "buy";
    } catch (error) {
      console.log(error.message, "error one");
      console.log("error two", currentAction, currentIndex);
      currentAction = "sell";
      // io.emit("assetPurchased", { data: await NotificationCount() });
    }
  }
  currentIndex++;
  console.log(
    colors.bgBrightCyan(
      `Checking CurrentIndex and CurrentAction,
      currentIndex: ${currentIndex},
      currentAction: ${currentAction},
      
      UserId:- ${JSON.stringify(
        users[currentIndex]
      )}
      `
    )
  );
  
  if (currentIndex <= lastUserIndex) {
    console.log("kisme aayuaa 1");
    await forNextAction();
  } else {
    currentIndex = 0;
    console.log("kisme aayuaa 2");
    await forNextAction();
  }
};

app.post("/api/startBot", (req, res) => {
  if (!isBotRunning) {
    isBotRunning = true;
    stopExecution = false;
    console.log("Bot started successfully");
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

server.listen(port, () =>
  console.log(`Example app listening on port ${port}!`)
);

io.on("connection", (socket) => {
  console.log("a user connected node");

  socket.on("disconnect", function () {
    console.log("A user disconnected");
  });
});
