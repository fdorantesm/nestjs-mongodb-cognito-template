import { Inject } from '@nestjs/common';

export function InjectService(
  serviceToken: string,
): PropertyDecorator & ParameterDecorator {
  return Inject(serviceToken);
}
