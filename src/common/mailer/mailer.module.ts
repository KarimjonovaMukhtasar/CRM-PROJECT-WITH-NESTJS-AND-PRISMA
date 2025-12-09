// pass: "tawr xonr olrn rovc"
import { MailerModule as NestMailerModule} from "@nestjs-modules/mailer"
import { MailerService } from "./mailer.service";
import { Global, Module } from "@nestjs/common";
import { HandlebarsAdapter } from "@nestjs-modules/mailer/dist/adapters/handlebars.adapter";
import { join } from "path";
import { ConfigModule, ConfigService } from "@nestjs/config";

@Global()
@Module({
    imports: [
        ConfigModule.forRoot({isGlobal: true}),
        NestMailerModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: ((config: ConfigService) => ({
                transport: {
                service: "gmail",
                auth: {
                    user: config.get("email"),
                    pass: config.get("pass")
                }
            },
            defaults: {
                    from: "N25STUDENT<karimjonovamukhtasar2003@gmail.com>"
                },
            template:{
                    dir: join(process.cwd(), "src","template"),
                    adapter: new HandlebarsAdapter(),
                    options: {
                        strict: true
                    }
                }
            }))
        })
    ],
    providers: [MailerService],
    exports: [MailerService]
})
export class MailerModule{}