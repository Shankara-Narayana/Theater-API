const ticketService = require("../services/ticketService");

const bookTicket = async (req, res) => {
  const { customerName, seatNumber, amount } = req.body;

  if (!customerName || !seatNumber || !amount) {
    return res.status(400).json({
      message: "customerName, seatNumber and amount are required"
    });
  }

  try {
    const result = await ticketService.bookTicket(customerName, seatNumber, amount);

    return res.status(201).json({
      message: "Ticket booked successfully",
      ...result
    });

  } catch (error) {
    return res.status(400).json({
      message: error.message,
      error: error.details || error.message
    });
  }
};

const cancelTicket = async (req, res) => {
  const { ticketId } = req.body;

  if (!ticketId) {
    return res.status(400).json({
      message: "ticketId is required"
    });
  }

  try {
    const result = await ticketService.cancelTicket(ticketId);

    return res.json({
      message: "Ticket cancelled successfully",
      ...result
    });

  } catch (error) {
    return res.status(error.statusCode || 400).json({
      message: error.message,
      error: error.details || error.message
    });
  }
};

const getAllTickets = (req, res) => {
  const tickets = ticketService.getAllTickets();

  res.json({
    message: "Tickets fetched successfully",
    tickets
  });
};

module.exports = {
  bookTicket,
  cancelTicket,
  getAllTickets
};