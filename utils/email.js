const nodemailer = require("nodemailer");
const pug = require("pug");

class Email {
    constructor(user, url) {
        this.name = user.name;
        this.email = user.email;
        this.from = process.env.EMAIL_FROM;
        this.url = url;
    }

    createTransport() {
        if (process.env.NODE_ENV.trim() === "development") {
            return nodemailer.createTransport({
                host: process.env.EMAIL_HOST,
                port: process.env.EMAIL_PORT,
                auth: {
                    user: process.env.EMAIL_USERNAME,
                    pass: process.env.EMAIL_PASSWORD,
                },
            });
        } else {
            return nodemailer.createTransport({
                host: process.env.EMAIL_HOST,
                port: process.env.EMAIL_PORT,
                auth: {
                    user: process.env.EMAIL_USERNAME,
                    pass: process.env.EMAIL_PASSWORD,
                },
            });
        }
    }

    async send(template, subject) {
        //1 Grab proper template
        const html = pug.renderFile(`${__dirname}/../views/${template}.pug`, {
            name: this.name,
            url: this.url,
        });
        //2 Set Options
        const mailOptions = {
            from: this.from,
            to: this.email,
            subject,
            html,
        };
        //3 Send email
        await this.createTransport().sendMail(mailOptions);
    }

    async sendWelcome() {
        await this.send("welcome", "Welcome to out TourApp Family!");
    }

    async sendResetPassword() {
        await this.send("reset", "Please follow link to reset password");
    }
}

module.exports = Email;