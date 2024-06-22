const express = require("express");

const app = express();

app.use(express.json());

const rooms = [];

const bookings = [];

const generateId = (type) => {
  if (type === "rooms") {
    if (rooms.length === 0) return 1;

    return rooms[rooms.length - 1].id + 1;
  } else if (type === "bookings") {
    if (bookings.length === 0) return 1;

    return bookings[bookings.length - 1].id + 1;
  }
};

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

app.post("/rooms", (request, response) => {
  const id = generateId("rooms");
  const data = { id, ...request.body };
  if (data) {
    rooms.push(data);
    return response.send({
      status: "success",
      data: data,
    });
  } else {
    return response.send({
      statusL: "fail",
      message: "There was an error in creating a room.",
    });
  }
});

app.post("/booking", (request, response) => {
  const room = rooms.find((room) => room.id == request.body.roomId);
  if (!room)
    return response.send({
      status: "fail",
      message: "Room not found",
    });

  if (bookings.length === 0) {
    bookRoom(request, response);
  } else if (room.id === request.body.roomId) {
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
          bookRoom(request, response);
        }
      }
    });
  }
});

app.get("/bookedRooms", (request, response) => {
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

app.get("/customerData", (request, response) => {
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

app.get("/rooms/:customer", (request, response) => {
  const customer = request.params.customer;
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

  const data = responseData.filter(
    (booking) => booking.customerName === customer
  );

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

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
