const express = require("express");
require('dotenv').config();
const router = express.Router();
const cors = require("cors");
const nodemailer = require("nodemailer");
const {EMAIL_USER, EMAIL_PASS,CORS_URL} = process.env;
// server used to send emails
const app = express();

// const corsOptions = {
// 	origin: CORS_URL,
// 	optionsSuccessStatus: 200
// };
//app.use(cors(corsOptions));
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', CORS_URL); // update to match the domain you will make the request from
  res.header('Access-Control-Allow-Credentials', 'false');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  next();
});
app.use(express.json());
app.use("/", router);
app.listen(5000, () => console.log("Server Running on 5000"));

const contactEmail = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS
  },
});

contactEmail.verify((error) => {
  if (error) {
    console.log(error);
  } else {
    console.log("Ready to Send");
  }
});

router.post("/contact", (req, res) => {
  const name = req.body.firstName + req.body.lastName;
  const email = req.body.email;
  const message = req.body.message;
  const phone = req.body.phone;
  const mail = {
    from: name,
    to: "laureanoiglesias34@gmail.com",
    subject: "Contact Form Submission - Portfolio",
    html: `<p>Name: ${name}</p>
           <p>Email: ${email}</p>
           <p>Phone: ${phone}</p>
           <p>Message: ${message}</p>`,
  };
  if(!req.body.firstName || !req.body.lastName || !req.body.email || !req.body.message || !req.body.phone){
    res.json({ code: 500, status: "Missing data" })
  }else{
    contactEmail.sendMail(mail, (error) => {
      if (error) {
        res.json(error);
      } else {
        res.json({ code: 200, status: "Message Sent" });
      }
    });
  }
});
