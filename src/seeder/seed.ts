import { NestFactory } from "@nestjs/core";
import { SeederModule } from "./seeder.module";
import { Seeder } from "./seeder";

async function bootstrap() {
    NestFactory.createApplicationContext(SeederModule)
        .then(appContext => {
            const seeder = appContext.get(Seeder);
            seeder
                .seed()
                .catch(error => {
                    throw error;
                })
                .finally(() => appContext.close());
        })
        .catch(error => {
            throw error;
        });
}
bootstrap();
