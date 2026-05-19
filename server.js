const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

app.post("/send-bulk", async (req, res) => {
  try {
    const { numbers, amount } = req.body;

    if (!numbers || !numbers.length) {
      return res.status(400).json({
        success: false,
        message: "No phone numbers provided"
      });
    }

    const results = [];

    for (const phone of numbers) {
      try {
        const response = await axios.post(
          `${process.env.SWIFTPAY_URL}/api/mpesa/stk-push-api`,
          {
            phone_number: phone,
            amount: amount,
            till_id: process.env.SWIFTPAY_TILL_ID,
            reference: "ORDER-" + Date.now()
          },
          {
            headers: {
              Authorization: `Bearer ${process.env.SWIFTPAY_API_KEY}`,
              "Content-Type": "application/json"
            }
          }
        );

        results.push({
          phone,
          success: true,
          response: response.data
        });

      } catch (error) {
        results.push({
          phone,
          success: false,
          error: error.response?.data || error.message
        });
      }

      await delay(2000);
    }

    res.json({
      success: true,
      results
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
