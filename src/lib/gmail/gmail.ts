import 'dotenv/config'
import { createTransport } from "nodemailer";

const mail = process.env.MAIL_ACCOUNT;
const pass = process.env.MAIL_PASSWORD;

type Props = {
    to: string;
    subject: string;
    text: string;
}

export const sendMail = async ({ to, subject, text }: Props) => {
    const transporter = createTransport({
        service: "Gmail",
        auth: {
            user: mail,
            pass: pass,
        }
    });

    await transporter.sendMail({
        from: mail,
        to,
        subject,
        text,
    }).catch((error) => {
        console.error("Error sending email:", error);
    });    
};
