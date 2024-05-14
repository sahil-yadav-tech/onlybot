
app.get("/api/notification", async (req, res) => {
    try {
      const allNotification = await errorModel.find({ status: "unread" });
      return res.status(200).json({
        message: "count",
        allNotification,
      });
    } catch (error) {
      console.log(error);
    }
  });
  
  app.put("/api/updateStatus", async (req, res) => {
    try {
      const result = await errorModel.updateMany({}, { status: "seen" });
      res.status(200).json({
        message: "Status updated successfully",
      });
    } catch (error) {
      console.error("Error updating status:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });
  
  const NotificationCount = async (req, res) => {
    const getCountOfNotification = await errorModel
      .find({
        status: "unread",
      })
      .countDocuments();
    return getCountOfNotification;
  };

  app.post("/api/setTime", async (req, res) => {
    const { firstTime, lastTime } = req.body;
    if (typeof firstTime !== "number" || isNaN(firstTime)) {
      return res.status(400).json({
        status: false,
        message: "First Time must be a number",
      });
    }
  
    if (typeof lastTime !== "number" || isNaN(lastTime)) {
      return res.status(400).json({
        status: false,
        message: "Last Time must be a number",
      });
    }
  
    try {
      const setTime = new SetTime({
        firstTime,
        lastTime,
      });
      const setTimeData = await setTime.save();
  
      return res.status(200).json({
        setTimeData,
        status: true,
      });
    } catch (error) {
      console.error("Error setting time:", error);
      return res.status(500).json({
        status: false,
        message: "Internal Server Error",
      });
    }
  });