// Importing required modules
const express = require("express");

// Creating express app
const app = express();

// Adding middleware to parse request body
app.use(express.json());

// Data
const rooms = [];
const bookings = [];

// Helper function to generate unique IDs
const generateId = (type) => {
  if (type === "rooms") {
    if (rooms.length === 0) return 1;

    return rooms[rooms.length - 1].id + 1;
  } else if (type === "bookings") {
    if (bookings.length === 0) return 1;

    return bookings[bookings.length - 1].id + 1;
  }
};

// Helper function to make a booking for a room.
const bookRoom = (request, response) => {
  const dateObj = new Date();
  const date = `${dateObj.getDate()}-${
    dateObj.getMonth() + 1
  }-${dateObj.getFullYear()}`;

  const id = generateId("bookings");
  const data = {
    id,
    ...request.body,
    status: "booked",
    bookingDate: date,
  };
  bookings.push(data);
  return response.send({
    status: "success",
    data: data,
  });
};

// Route to create a room.
app.post("/rooms", (request, response) => {
  // Getting an ID for the room to be created.
  const id = generateId("rooms");
  const data = { id, ...request.body };
  //   Validating data before creating a room.
  if (data) {
    rooms.push(data);
    return response.send({
      status: "success",
      data: data,
    });
  } else {
    return response.send({
      status: "fail",
      message: "There was an error in creating a room.",
    });
  }
});

// Route to make a booking for the room.
app.post("/booking", (request, response) => {
  // Checking if a room of such ID exists.
  const room = rooms.find((room) => room.id == request.body.roomId);
  if (!room)
    return response.send({
      status: "fail",
      message: "Room not found",
    });

  // If this is the first booking, no need to check if the room has been booked or not.
  if (bookings.length === 0) {
    bookRoom(request, response);
  }
  // Validating whether the hall is booked or not.
  else if (room.id === request.body.roomId) {
    bookings.forEach((booking) => {
      if (booking.date === request.body.date) {
        if (
          booking.startTime === request.body.startTime &&
          booking.endTime === request.body.endTime
        ) {
          return response.send({
            status: "fail",
            message: "Room already booked",
          });
        } else {
          // Make booking if the room is not booked.
          bookRoom(request, response);
        }
      }
    });
  }
});

// Route to get all rooms that are booked by customers.
app.get("/bookedRooms", (request, response) => {
  // If there are no bookings made, sending a different response accordingly.
  if (bookings.length === 0)
    return response.send({
      message: "No bookings found",
    });
  const responseData = [];
  bookings.forEach((booking) => {
    const { name } = rooms.find((room) => room.id === booking.roomId);
    booking.name = name;
    responseData.push({
      roomName: name,
      status: booking.status,
      customerName: booking.customerName,
      date: booking.date,
      startTime: booking.startTime,
      endTime: booking.endTime,
    });
  });
  response.send(responseData);
});

// Route to get all customers who made a booking.
app.get("/customerData", (request, response) => {
  // Handling no bookings made condition
  if (bookings.length === 0)
    return response.send({
      message: "No bookings found",
    });

  const responseData = [];
  bookings.forEach((booking) => {
    const { name } = rooms.find((room) => room.id === booking.roomId);
    booking.name = name;
    responseData.push({
      roomName: name,
      customerName: booking.customerName,
      date: booking.date,
      startTime: booking.startTime,
      endTime: booking.endTime,
    });
  });
  response.send(responseData);
});

// Route to get all bookings made by a customer with booking count.
app.get("/rooms/:customer", (request, response) => {
  // Getting query parameter from url.
  const customer = request.params.customer;
  // Constructiing data to be responded with.
  const responseData = [];
  bookings.forEach((booking) => {
    const { name } = rooms.find((room) => room.id === booking.roomId);
    booking.name = name;
    responseData.push({
      roomName: name,
      customerName: booking.customerName,
      date: booking.date,
      startTime: booking.startTime,
      endTime: booking.endTime,
      bookingId: booking.id,
      status: booking.status,
      bookingDate: booking.date,
    });
  });

  //   Filtering data based on query parameter.
  const data = responseData.filter(
    (booking) => booking.customerName === customer
  );

  //   Sending a response based on the data.
  if (data.length === 0)
    return response.send({
      message: `No bookings made by ${customer}`,
      count: 0,
    });
  return response.send({
    status: "success",
    count: data.length,
    data: data,
  });
});

// Creating a server that runs on port 3000.
app.listen(3000, () => {
  console.log("Server started on port 3000");
});
