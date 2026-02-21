import { Global, Module } from "@nestjs/common";
import { MailerModule } from "@nestjs-modules/mailer";
import { HandlebarsAdapter } from "@nestjs-modules/mailer/dist/adapters/handlebars.adapter"
import { join } from "path";
import { EmailService } from "./email.service";

/*
ltmf lcrx qkfe owkt
*/

@Global()
@Module({
    imports: [
        MailerModule.forRoot({
            transport: {
                service: "gmail",
                auth: {
                    user: "ibrohim.meliqulov2003@gmail.com",
                    pass: "ltmf lcrx qkfe owkt"
                },
            },
            defaults: {
                from: "N26 <ibrohim.meliqulov2003@gmail.com>",
            },
            template: {
                dir: join(process.cwd(), "src", "templates"),
                adapter: new HandlebarsAdapter(),
                options: {
                    strict: true
                }
            }
        })
    ],
    providers: [EmailService],
    exports: [EmailService]
})
export class EmailModule { }