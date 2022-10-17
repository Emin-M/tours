const SibApiV3Sdk = require('sib-api-v3-sdk');
const pug = require("pug");

class Email {
    constructor(user, url) {
        this.name = user.name;
        this.email = user.email;
        this.from = process.env.EMAIL_FROM;
        this.url = url;
    };

    createTransport() {
        SibApiV3Sdk.ApiClient.instance.authentications['api-key'].apiKey = process.env.SENDINBLUE_API_KEY;

        return new SibApiV3Sdk.TransactionalEmailsApi();
    };

    async send(template, subject) {
        //1 Grab proper template
        const html = pug.renderFile(`${__dirname}/../views/${template}.pug`, {
            name: this.name,
            url: this.url,
        });

        //2 Set Options
        const mailOptions = {
            "subject": subject,
            "sender": {
                "email": "api@sendinblue.com",
                "name": "Sendinblue"
            },
            "replyTo": {
                "email": 'api@sendinblue.com',
                "name": 'Sendinblue'
            },
            "to": [{
                "name": this.name,
                "email": this.email
            }],
            "htmlContent": html,
        };

        //3 Send Email
        await this.createTransport().sendTransacEmail(mailOptions);
    };

    async sendWelcome() {
        await this.send("welcome", "Welcome to our TourApp Family!");
    };

    async sendResetPassword() {
        await this.send("reset", "Please follow link to reset password");
    };
};

module.exports = Email;