import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';

export function setupValidation(app: NestExpressApplication): void {
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      exceptionFactory: (errors) => {
        const fields = errors.map((error) => error.property);
        const errorMessages = errors.reduce<string[]>((acc, error) => {
          return acc.concat(Object.values(error.constraints || {}));
        }, []);

        return new BadRequestException({
          errors: errorMessages,
          message: `Validation failed for fields: ${fields.join(' ')}`,
        });
      },
    }),
  );
}
