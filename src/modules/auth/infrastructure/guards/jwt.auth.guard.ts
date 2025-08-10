import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Logger,
  Inject,
  UnauthorizedException,
} from '@nestjs/common';
import { IdentityService } from '@/modules/auth/infrastructure/services/identity.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    @Inject('IdentityService')
    private readonly identityService: IdentityService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authorization = request.headers['authorization'];
    const isBearer = authorization && authorization.startsWith('Bearer');

    if (!authorization || !isBearer) {
      return false;
    }

    const match = authorization.match(/^Bearer\s+(.+)$/);
    const token = match && match[1] ? match[1].trim() : '';

    try {
      const decoded = await this.identityService.validateAccessToken(token);
      request.user = {
        sub: decoded.sub,
      };
      return true;
    } catch (error) {
      Logger.error('Error validating token:', error.stack);
      throw new UnauthorizedException();
    }
  }
}
