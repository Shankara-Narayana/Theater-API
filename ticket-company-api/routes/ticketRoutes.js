const express = require("express");
const router = express.Router();

const ticketController = require("../controllers/ticketController");

router.post("/book", ticketController.bookTicket);
router.post("/cancel", ticketController.cancelTicket);
router.get("/", ticketController.getAllTickets);

module.exports = router;