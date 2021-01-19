const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const nodemailer = require("nodemailer");
const smtpTransport = require("nodemailer-smtp-transport");
const url =
  "mongodb+srv://kaushik:UlPo8dbZcz7x5mJz@cluster0.x986q.mongodb.net/hotelManagement?retryWrites=true&w=majority";

const connectionParams = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
};
mongoose
  .connect(url, connectionParams)
  .then(() => {
    console.log("Connected to database ");
  })
  .catch((err) => {
    console.error(`Error connecting to the database. \n${err}`);
  });

let app = express();

app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));

let Room = require("./models/room-model");
let Order = require("./models/order-model");

app.post("/", (req, res) => {
  console.log("hi hotel");
  let daysOfYear = [];
  for (
    let d = new Date(req.body.checkInDate);
    d <= new Date(req.body.checkOutDate);
    d.setDate(d.getDate() + 1)
  ) {
    daysOfYear.push(`${d.getDate()}-${d.getMonth() + 1}-${d.getFullYear()}`);
    console.log(`${d.getDate()}-${d.getMonth() + 1}-${d.getFullYear()}`);
  }
  Room.findOne(
    { id: req.body.roomId },
    "totalRooms",
    async function (err, room) {
      if (err) return console.log(err);
      let loop = true;
      let dateRoomFull;
      for (
        let d = new Date(req.body.checkInDate);
        d <= new Date(req.body.checkOutDate) && loop;
        d.setDate(d.getDate() + 1)
      ) {
        let orders = await Order.find({
          roomId: req.body.roomId,
          date: `${d.getDate()}-${d.getMonth() + 1}-${d.getFullYear()}`,
        });
        if (orders.length >= room.totalRooms) {
          console.log("room full");
          loop = false;
          dateRoomFull = `${d.getDate()}-${
            d.getMonth() + 1
          }-${d.getFullYear()}`;
          // return;
        }
      }
      if (!loop) {
        console.log("returning");
        res.json({
          roomFull: true,
          dateRoomFull,
        });
      }
      if (loop) {
        let objToStore = {
          roomId: req.body.roomId,
          date: daysOfYear,
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          email: req.body.email,
        };
        const order = new Order(objToStore);
        console.log(objToStore);
        order.save().then((orderReturned) => {
          console.log("order saved");
          console.log(orderReturned);

          let sendHTML = `
              <h1>Hi ${orderReturned.firstName}</h1>
              <br/>
              <p>Your Order ID is: ${orderReturned._id}</p>
          `;
          let transporter = nodemailer.createTransport(
            smtpTransport({
              // service: "gmail",
              // auth: {
              //   user: "buyenggprojects@gmail.com",
              //   pass: "ASDFmnbv@!",
              // },
              host: "smtp.mailtrap.io",
              port: 2525,
              auth: {
                user: "8d4a223302421e",
                pass: "d00d8ad77d2725",
              },
            })
          );
          transporter.sendMail(
            {
              from: '"Nodemailer" <jeevanmahesh00@gmail.com>',
              to: orderReturned.email,
              subject: "Thanks for booking a room",
              text: "Thanks for booking a room",
              html: sendHTML,
            },
            function (error, info) {
              if (error) {
                console.log(error);
              } else {
                console.log("Email sent: " + info.response);
              }
            }
          );
          res.json({ roomFull: false, orderId: orderReturned._id });
        });
      }
    }
  );
});

app.get("/abc", (req, res) => {
  res.json({});
  Order.findOne({ firstName: "Kaushik" }, "date", function (err, order) {
    if (err) return handleError(err);
    console.log(order);
  });
});

app.listen(3003, () => {
  console.log("server started on port 3001");
});
