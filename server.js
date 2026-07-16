console.log("JAI SHREE RAM JI / JAI BAJARANG BALI JI 👏🧡");

import express from "express";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
const port = process.env.PORT || 1112;  // Changed to 1111 to match frontend

// CORS Configuration
const corsOptions = {
  origin: ["http://localhost:3000", "https://yourdomain.com"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

// Generate 10 Random Data
const generateRandomData = () => {
  const statuses = ["Active", "Inactive", "Pending", "Completed", "Failed"];
  const emails = [
    "john@email.com", 
    "jane@email.com", 
    "bob@email.com", 
    "alice@email.com",
    "charlie@email.com",
    "diana@email.com",
    "eric@email.com",
    "fiona@email.com",
    "george@email.com",
    "hannah@email.com"
  ];
  
  return Array.from({ length: 10 }, (_, index) => ({
    id: index + 1,
    status: statuses[Math.floor(Math.random() * statuses.length)],
    email: emails[Math.floor(Math.random() * emails.length)],
    amount: Math.floor(Math.random() * 10000) + 100,  // Random amount between 100-10100
    createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
  }));
};

// API Route - Get All Data
app.get("/", async (req, res) => {
  try {
    const data = generateRandomData();
    
    return res.status(200).json({
      success: true,
      message: "All data fetched successfully",
      data: data,
      total: data.length
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching data",
      error: error.message
    });
  }
});

// API Route - Get Single Data by ID
app.get("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const allData = generateRandomData();
    const data = allData.find(item => item.id === id);
    
    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Data not found"
      });
    }
    
    return res.status(200).json({
      success: true,
      message: "Data fetched successfully",
      data: data
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching data",
      error: error.message
    });
  }
});

app.listen(port, () => {
  console.log(`🚀 Server running on ports ${port}`);
  console.log(`📊 API URL: http://localhost:${port}`);
});