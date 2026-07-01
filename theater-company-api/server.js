const express = require("express");
const app = express();

app.use(express.json());

let seats = [
  { seatNumber: 1, status: "AVAILABLE" },
  { seatNumber: 2, status: "AVAILABLE" },
  { seatNumber: 3, status: "AVAILABLE" },
  { seatNumber: 4, status: "AVAILABLE" },
  { seatNumber: 5, status: "AVAILABLE" }
];

// Get all seats
app.get("/seats", (req, res) => {
  res.json({
    message: "Seat details fetched successfully",
    seats
  });
});

// Book seat
app.post("/seats/book", (req, res) => {
  const { seatNumber } = req.body;

  const seat = seats.find(s => s.seatNumber === seatNumber);

  if (!seat) {
    return res.status(404).json({
      message: "Seat not found"
    });
  }

  if (seat.status === "BOOKED") {
    return res.status(400).json({
      message: "Seat already booked"
    });
  }

  seat.status = "BOOKED";

  res.json({
    message: "Seat booked successfully",
    seat
  });
});

// Release seat during cancellation
app.post("/seats/release", (req, res) => {
  const { seatNumber } = req.body;

  const seat = seats.find(s => s.seatNumber === seatNumber);

  if (!seat) {
    return res.status(404).json({
      message: "Seat not found"
    });
  }

  seat.status = "AVAILABLE";

  res.json({
    message: "Seat released successfully",
    seat
  });
});

app.listen(3001, () => {
  console.log("Theater Company API running on port 3001");
});