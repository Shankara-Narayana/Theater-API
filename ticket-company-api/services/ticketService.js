const axios = require("axios");
const tickets = require("../data/ticketData");
const { THEATER_API_URL, PAYMENT_API_URL } = require("../config/apiConfig");

const bookTicket = async (customerName, seatNumber, amount) => {
  let seatResponse;

  try {
    // Step 1: Book seat from Theater Company API
    seatResponse = await axios.post(`${THEATER_API_URL}/seats/book`, {
      seatNumber
    });

    try {
      // Step 2: Make payment from Payment Company API
      const paymentResponse = await axios.post(`${PAYMENT_API_URL}/payment/pay`, {
        customerName,
        amount
      });

      // Step 3: Create ticket
      const ticket = {
        ticketId: Date.now(),
        customerName,
        seatNumber,
        amount,
        paymentId: paymentResponse.data.paymentId,
        ticketStatus: "BOOKED"
      };

      tickets.push(ticket);

      return {
        seatDetails: seatResponse.data,
        paymentDetails: paymentResponse.data,
        ticket
      };

    } catch (paymentError) {
      // If payment fails, release the booked seat
      await axios.post(`${THEATER_API_URL}/seats/release`, {
        seatNumber
      });

      const error = new Error("Payment failed, so seat has been released");
      error.details = paymentError.response?.data || paymentError.message;
      throw error;
    }

  } catch (seatError) {
    const error = new Error("Seat booking failed");
    error.details = seatError.response?.data || seatError.message;
    throw error;
  }
};

const cancelTicket = async (ticketId) => {
  const ticket = tickets.find(t => t.ticketId === ticketId);

  if (!ticket) {
    const error = new Error("Ticket not found");
    error.statusCode = 404;
    throw error;
  }

  if (ticket.ticketStatus === "CANCELLED") {
    const error = new Error("Ticket already cancelled");
    error.statusCode = 400;
    throw error;
  }

  try {
    // Step 1: Refund from Payment Company API
    const refundResponse = await axios.post(`${PAYMENT_API_URL}/payment/refund`, {
      paymentId: ticket.paymentId,
      amount: ticket.amount
    });

    // Step 2: Release seat from Theater Company API
    const seatReleaseResponse = await axios.post(`${THEATER_API_URL}/seats/release`, {
      seatNumber: ticket.seatNumber
    });

    // Step 3: Update ticket status
    ticket.ticketStatus = "CANCELLED";

    return {
      refundDetails: refundResponse.data,
      seatUpdateDetails: seatReleaseResponse.data,
      ticket
    };

  } catch (error) {
    const customError = new Error("Ticket cancellation failed");
    customError.details = error.response?.data || error.message;
    throw customError;
  }
};

const getAllTickets = () => {
  return tickets;
};

module.exports = {
  bookTicket,
  cancelTicket,
  getAllTickets
};