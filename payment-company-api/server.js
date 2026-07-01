const express = require("express");
const app = express();

app.use(express.json());

// Make payment
app.post("/payment/pay", (req, res) => {
  const { customerName, amount } = req.body;

  if (!customerName || !amount) {
    return res.status(400).json({
      message: "Customer name and amount are required"
    });
  }

  if (amount < 200) {
    return res.status(400).json({
      message: "Payment failed. Minimum ticket amount is 200"
    });
  }

  const paymentId = Date.now();

  res.json({
    message: "Payment successful",
    paymentId,
    customerName,
    amount,
    paymentStatus: "SUCCESS"
  });
});

// Refund payment
app.post("/payment/refund", (req, res) => {
  const { paymentId, amount } = req.body;

  if (!paymentId || !amount) {
    return res.status(400).json({
      message: "Payment ID and amount are required"
    });
  }

  res.json({
    message: "Refund successful",
    paymentId,
    refundedAmount: amount,
    refundStatus: "SUCCESS"
  });
});

app.listen(3002, () => {
  console.log("Payment Company API running on port 3002");
});