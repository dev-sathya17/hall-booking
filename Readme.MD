# GUVI - DAY 38

## Hall Booking API Task.

### How to run the project on your machine:

1. Pull the repository to your local machine.

```
git pull
```

2. To install all the dependencies:

```
npm install
```

3. Once everything is installed successfully, now it's time to run the server.

```
npm run dev
```

### Dependencies used

1. express

```
npm install express
```

2. nodemon

```
npm install nodemon --save-dev
```

### About the Task.

1. The task is to create API routes for a Hall Booking application.
2. We use express.js library in NodeJS to run a javascript application as a server.

### Setup.

1. We create a new project using the npm package manager in node.js.
2. We run the following command to create a new project.

```
    npm init
```

3. We specify the details required for initializing the project asked in the terminal.
4. We install the `express` library by using installation command from the npm package manager.
5. We create a javascript file named `index.js` which is the root of the project.
6. We add a package called as `nodemon` to help us automate the development process. It restarts the server every time it detects changes in the code.
7. We change the `package.json` file to include start and dev parameter to make the script run from the command `npm run dev`.

### Solution.

1. First we create an express app after imoprting express to our file.
2. We add a middleware to parse the request body as json.
3. We create a server that listens on the port specified.
4. The data is managed in 2 arrays of objects one for the rooms, other for the bookings made.
5. Now, we start creating API routes as specified in the task document.

   1. Creating a room.

      > - We create a POST route, that gets the request body as input.
      > - We generate ID for it using our helper function `generateId()`.
      > - The data is constructed using the `spread operator` and pushed to the array.
      > - A successful response is returned.

   2. Booking a room.

      > - We create a POST route, that gets the request body as input.
      > - First, we validate whether the room id mentioned in the request body is valid and exists.
      > - Then we check if the room is already booked at the same date and time.
      > - Respective response objects are sent while validating.
      > - We create a helper function to book the room successfully.
      > - If the room is not booked, we add the data to the array and send a success message.
      > - The room is also booked, when the array is initially empty.

   3. List all rooms that are booked.

      > - This is a GET request.
      > - If there are no rooms booked, we send a response saying, there are no bookings made.
      > - We iterate over all the bookings made using the `forEach` method.
      > - We pick the room name from the rooms array using the `find` method.
      > - The data is constructed as mentioned in the doc and sent in the response.

   4. List all customers who have made a booking.

      > - This is a GET request.
      > - If there are no rooms booked, we send a response saying, there are no bookings made.
      > - We iterate over all the bookings made using the `forEach` method.
      > - We pick the room name from the rooms array using the `find` method.
      > - The data is constructed as mentioned in the doc and sent in the response.

   5. List how many times a customer has booked a room with details.
      > - This is a GET request that accepts a customer name as a query parameter.
      > - We iterate over all the bookings made using the `forEach` method.
      > - We pick the room name from the rooms array using the `find` method.
      > - The data is constructed and filtered using the filter method to match the customer.
      > - The count of the customer bookings and the data of the bookings are sent as response.

### Postman Documentation

> - Here is a link to the postman documentation for all the APIs. [Postman Documentation](https://documenter.getpostman.com/view/25007380/2sA3XWbyR1)
