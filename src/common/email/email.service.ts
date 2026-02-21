import { MailerService } from "@nestjs-modules/mailer";
import { Injectable } from "@nestjs/common";


@Injectable()
export class EmailService {
    constructor(private readonly mailService: MailerService) { }
    async sendEmail(email: string, login: string, password: string) {
        await this.mailService.sendMail({
            to: email,
            from: "ibrohim.meliqulov2003@gmail.com",
            subject: "CRM",
            template: "index.hbs",
            context: {
                login,
                password
            }
        })
    }
}