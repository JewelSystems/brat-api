import nodemailer from 'nodemailer';


export default {
  async sendEmail(){
    try{
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'brat2021test@gmail.com',
          pass: 'Brat2021test!'
        }
      });
      
      const mailOptions = {
        from: 'brat2021test@gmail.com',
        to: 'ditocosta@gmail.com',
        subject: 'Sending Email using Node.js',
        text: 'That was easy!'
      };
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
      return 'ok';
    }catch(error){
      console.log(error);
      return 'fail';
    }
  },
};