import {Transporter, TransportOptions, createTransport} from "nodemailer";
import dotenv from "dotenv";
import ejs from "ejs";
import { MailOptions } from "nodemailer/lib/ses-transport";
import path from "path";
dotenv.config()

const configOptions = {
    host: process.env.MAIL_HOST!,
    service: process.env.MAIL_SERVICE!,
    port: Number(process.env.MAIL_PORT!),
    auth: {
        user: process.env.MAIL_USER!,
        pass: process.env.MAIL_PASSWORD!
    }
}

type Views = ({count: number, title: string})[];

interface mailer_int{
    sendPasswordResetToken: (link: string) =>Promise<void>,
    sendUserFeedBack: (views: Views) => Promise<void> 
}

class Mailer implements mailer_int{
    constructor(
        private email: string,
        private Transporter: Transporter = createTransport(configOptions),

    ){}
        mailOptions: MailOptions = {
            to: this.email,
            from: process.env.MAIL_USER!,
            html: undefined
        }
        sendPasswordResetToken = async(link: string)=>{
            this.mailOptions.html = await ejs.renderFile(path.resolve(__dirname,"../views/password-reset.ejs"), {link})
            return this.Transporter.sendMail(this.mailOptions)
        }
        sendUserFeedBack = async(views: Views)=>{
            this.mailOptions.html = await ejs.renderFile(path.resolve(__dirname,"../views/feedback.ejs"),{views})
            return this.Transporter.sendMail(this.mailOptions)
        }
}

export default Mailer;
