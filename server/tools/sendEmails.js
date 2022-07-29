/**
 * This file allows to send emails mainly for the purpose of resetting
 * a password, but admiin can use function in this file to send notifications
 * if needed
 * 
 * The file uses the library nodemailer, hence thier documentation was followed
 * to implement the feature
 * 
 * URL :https://nodemailer.com/smtp/
 * 
 * @author Muaad Alrawhani, B00538563
 */



import nodemailer from "nodemailer"

/**
 * create a transport
 * Choosing to use yahoo email service for simplicity
 */
let transporter = nodemailer.createTransport({
  service: 'yahoo',
  auth: {
    user: 'advwebdevg1@yahoo.com',
    pass: 'hnsaludlnoswzqmf'
  }
});


/**
 * To send a reset code to the user
 * @param {*} to the recipient email address
 * @param {*} code password the resetcode
 */
function sendResetEmail(to, code) {
  //url of the reset link
  const url = `http://ec2-54-242-106-30.compute-1.amazonaws.com/auth/resetByEmail/?code=${code}`

  //prepare email options
  const mailOptions = {
    from: "advwebdevg1@yahoo.com",
    to,
    subject: "Reset your pasword",
    html: `Hello, <br><br> 
        click on the link below to reset your password:<br>
        <a href="${url}">${url}</a><br><br>
        Thank you,<br>
        CSCI4177 Group-1        `
  };

  //ask transporter to send the email
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}

/**
 * to send a notification emails to the user (by admin) 
 * @param {*} to the recipient email address
 * @param {*} subject the subject of the email
 * @param {*} body the body of the email
 */
function sendEmail(to, subject, body) {

  //prepare email options
  const mailOptions = {
    from: "advwebdevg1@yahoo.com",
    to: to,
    subject: subject,
    html: `${body}<br><br>CSCI4177 Group-1`
  }

  //ask transporter to send the email
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });

};


export default sendResetEmail
export { sendEmail }