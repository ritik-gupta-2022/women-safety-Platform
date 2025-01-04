import nodemailer from 'nodemailer'
import Mailgen from "mailgen"

export const mail = async (username, contact, locationUrl) => {
    const { email, name } = contact;

    const config = {
        service: process.env.SMTP_SERVICE,
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD,
        },
    };

    const transporter = nodemailer.createTransport(config);

    const MailGenerator = new Mailgen({
        theme: 'default',
        product: {
            name: 'Women Safety App',
            link: 'https://yourwebsite.com',
        },
    });

    const response = {
        body: {
            name: name,
            intro: `This is an Emergency alert sent by ${username}. 
            I am in danger, please help me... I have attached my current location. Location: ${locationUrl}`,
            description: `I am in danger, please help me... I have attached my current location. Location: ${locationUrl}`,
            outro: 'This is in testing mode, please do not consider this message as serious.',
        },
    };

    const emailHtml = MailGenerator.generate(response);

    const message = {
        from: process.env.EMAIL,
        to: email,
        subject: 'Emergency Alert!',
        html: emailHtml,
    };

    await transporter.sendMail(message);
};