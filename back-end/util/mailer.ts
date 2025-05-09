// mailer.ts
import nodemailer from 'nodemailer';

console.log('User:', process.env.EMAIL_USER);
console.log('Pass:', process.env.EMAIL_PASSWORD);

const transporter = nodemailer.createTransport({
    service: 'gmail', // or another provider like 'hotmail'
    auth: {
        user: process.env.EMAIL_USER, // your email
        pass: process.env.EMAIL_PASSWORD, // your app password (not normal login password)
    },
});

export default transporter;
