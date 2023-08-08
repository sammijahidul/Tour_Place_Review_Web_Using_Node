// eslint-disable-next-line import/no-extraneous-dependencies
const nodemailer = require('nodemailer');
const pug = require('pug');
// eslint-disable-next-line import/no-extraneous-dependencies
const { convert } = require('html-to-text');

// new Email(user, url).sendWelcome();

module.exports = class Email {
    constructor(user, url) {
        this.to = user.email;
        this.firsName = user.name.split(' ')[0];
        this.url = url;
        this.from = `Jahidul Islam <${process.env.EMAIL_FROM}>`;
    }

    newTransport() {
        if(process.env.NODE_ENV === 'production') {
            return nodemailer.createTransport({
                host: "smtp-relay.brevo.com",
                port: 587,
                auth: {
                    user: process.env.BREVO_USERNAME,
                    pass: process.env.BREVO_PASSWORD
                }

            })
        }
          // Create a transporter
          return nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD
            }
        })
    }

    async send(template, subject) {
        // 1) Render HTML base on a pug template
        const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, 
        {
            firsName: this.firsName,
            url: this.url,
            subject
        })

        // 2) Define email options
        const mailOptions = {
            // from: 'Jahidul Islam <sammi2@gmail.com>',
            from: this.from,
            to: this.to,
            subject,
            html,
            text: convert(html)   
        };

        // 3) Create a transport and send email
        ;
        await this.newTransport().sendMail(mailOptions)
    }

    async sendWelcome() {
        await this.send('welcome', 'Welcome to the Natours family!');
    }

    async sendPasswordReset() {
        await this.send('passwordReset', 'Your password reset token (valid for only 10 mins')
    }
};




