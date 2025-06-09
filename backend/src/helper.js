const nodemailer = require("nodemailer")

function sendMail(recieverEmailId, subject, body) {
    const transporter = nodemailer.createTransport({
        // host: "smtp.ethereal.email",
        // port: 587,
        // secure: false, // true for 465, false for other ports
        service: "gmail",
        auth: {
          user: process.env.MAILER_USER,
          pass: process.env.MAILER_PASSWORD
        },
      });


      return transporter.sendMail({
        from: "10xtarun@gmail.com",
        to: recieverEmailId, 
        subject: subject,
        text: body
      })
      .then(sentInfo => {
        console.log("email sent: ", sentInfo)
      })
      .catch(error => {
        console.log("email not sent: ", error)
        throw "otp sent failed, retry after sometime"
      })
}

function getEpochMilliSeconds(dateTimeString) {
  let milliseconds = Date.parse(dateTimeString)

  if(milliseconds == NaN) {
    throw "invalid date time format"
  }

  return milliseconds
}

function checkIsDateTimeFuture(milliseconds) {
  let currentMilliSeconds = Date.now()

  if(milliseconds <= currentMilliSeconds) {
    throw "date time cannot be of past"
  }

  return milliseconds
}


module.exports = {
    sendMail,
    getEpochMilliSeconds,
    checkIsDateTimeFuture
}