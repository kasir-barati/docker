import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { Logger } from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = 61412;

  await app.listen(port);

  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/graphql`,
    "Bootstrap",
  );
  Logger.log(
    `🚀 GraphQL IDE is running on: http://localhost:${port}/graphql`,
    "Bootstrap",
  );
}

bootstrap().catch((error) => {
  Logger.error(error, "Bootstrap");
  process.exit(1);
});
