const express = require("express");
const ticketRoutes = require("./routes/ticketRoutes");

const app = express();

app.use(express.json());

app.use("/ticket", ticketRoutes);

app.listen(3003, () => {
  console.log("Ticket Company API running on port 3003");
});
``