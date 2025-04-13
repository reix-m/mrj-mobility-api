import { ApiModule } from '@application/api/api.module';
import { ApiServerConfig } from '@infra/config/api-server.config';
import { ConsoleLogger, Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import { initializeTransactionalContext, StorageDriver } from 'typeorm-transactional';

export class ServerApplication {
  private readonly host: string = ApiServerConfig.Host;

  private readonly port: number = ApiServerConfig.Port;

  public async run(): Promise<void> {
    this.startTransactionalContext();

    const app: NestExpressApplication = await NestFactory.create(ApiModule, {
      logger: new ConsoleLogger({
        json: true,
      }),
    });

    this.buildAPIDocumentation(app);
    this.log();

    await app.listen(this.port, this.host);
  }

  private startTransactionalContext(): void {
    initializeTransactionalContext({ storageDriver: StorageDriver.AUTO });
  }

  private buildAPIDocumentation(app: NestExpressApplication): void {
    const title: string = 'Mrj Mobility Http Rest API';
    const description: string = 'Mrj Mobility Http Rest API documentation';
    const version: string = process.env.npm_package_version ?? '1.0.0';

    const options: Omit<OpenAPIObject, 'paths'> = new DocumentBuilder()
      .setTitle(title)
      .setDescription(description)
      .setVersion(version)
      .addBearerAuth()
      .build();

    const document: OpenAPIObject = SwaggerModule.createDocument(app, options);

    SwaggerModule.setup('docs', app, document, {
      jsonDocumentUrl: '/docs/format.json',
    });
  }

  private log(): void {
    Logger.log(`Server started on host: ${this.host}; port: ${this.port};`, ServerApplication.name);
  }

  public static new(): ServerApplication {
    return new ServerApplication();
  }
}
