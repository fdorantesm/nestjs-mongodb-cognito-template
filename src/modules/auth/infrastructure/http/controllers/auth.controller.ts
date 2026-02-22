import {
  Controller,
  Get,
  UseGuards,
  Req,
  Body,
  Post,
  UnauthorizedException,
  InternalServerErrorException,
  ConflictException,
  VERSION_NEUTRAL,
  Logger,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import type { Context } from '@/core/domain/interfaces/context.interface';
import { Ctx } from '@/core/infrastructure/decorators/context.decorator';
import { Endpoint } from '@/core/infrastructure/decorators/api-endpoint.decorator';
import { ProtectedEndpoint } from '@/core/infrastructure/decorators/protected-endpoint.decorator';
import type { Request } from '@/core/infrastructure/types/http/request.type';
import { JwtAuthGuard } from '@/modules/auth/infrastructure/guards/jwt.auth.guard';
import { ChallengeDto } from '@/modules/auth/infrastructure/http/dtos/challenge.dto';
import { LoginDto } from '@/modules/auth/infrastructure/http/dtos/login.dto';
import { RefreshTokenDto } from '@/modules/auth/infrastructure/http/dtos/refresh-token.dto';
import { UserNotConfirmedException } from '@/core/domain/exceptions/user-not-confirmed';
import { InvalidCredentialsException } from '@/core/domain/exceptions/invalid-credentials';
import { LoginUseCase } from '@/modules/auth/application/use-cases/login.use-case';
import { LogoutUseCase } from '@/modules/identity/application/use-cases/logout.use-case';
import { RefreshTokenUseCase } from '@/modules/auth/application/use-cases/refresh-token.use-case';
import { RespondChallengeUseCase } from '@/modules/auth/application/use-cases/respond-challenge.use-case';
import { MeUseCase } from '@/modules/auth/application/use-cases/me.use-case';
import { GetUserPermissionsUseCase } from '@/modules/auth/application/use-cases/get-user-permissions.use-case';
import { GetUserExtrasUseCase } from '@/modules/users/application/use-cases/get-user-extras.use-case';
import { RequirePermissions } from '@/modules/auth/infrastructure/decorators';
import { PermissionGuard } from '@/modules/auth/infrastructure/guards';

@ApiTags('auth')
@Controller({ path: '/auth', version: VERSION_NEUTRAL })
export class AuthController {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly logoutUseCase: LogoutUseCase,
    private readonly respondChallengeUseCase: RespondChallengeUseCase,
    private readonly refreshTokenUseCase: RefreshTokenUseCase,
    private readonly meUseCase: MeUseCase,
    private readonly getUserPermissionsUseCase: GetUserPermissionsUseCase,
    private readonly getUserExtrasUseCase: GetUserExtrasUseCase,
  ) {}

  @Post('/login')
  @Endpoint('User login', { body: LoginDto })
  public async login(@Ctx() ctx: Context, @Body() body: LoginDto) {
    try {
      return await this.loginUseCase.execute(ctx, body.email, body.password);
    } catch (error) {
      // NOSONAR - S1301 switch without default case
      switch (error.name) {
        case 'UserNotConfirmedException': {
          throw new ConflictException(new UserNotConfirmedException());
        }
        case 'InvalidCredentialsException': {
          throw new UnauthorizedException(new InvalidCredentialsException());
        }
        case 'UserNotFoundException': {
          throw new UnauthorizedException(new InvalidCredentialsException());
        }
        default: {
          Logger.error(
            `Login error: ${error.name} - ${error.message}`,
            error.stack,
            ctx.requestId,
          );
          throw new InternalServerErrorException();
        }
      }
    }
  }

  @Post('/challenge')
  @Endpoint('Respond to authentication challenge', { body: ChallengeDto })
  public async challenge(@Ctx() ctx: Context, @Body() body: ChallengeDto) {
    try {
      return await this.respondChallengeUseCase.execute(ctx, body);
    } catch (error) {
      // NOSONAR - S1301 switch without default case
      switch (error.name) {
        case 'UserNotConfirmedException': {
          throw new ConflictException(new UserNotConfirmedException());
        }
        case 'InvalidCredentialsException': {
          throw new UnauthorizedException(new InvalidCredentialsException());
        }
        case 'UserNotFoundException': {
          throw new UnauthorizedException(new InvalidCredentialsException());
        }
        default: {
          throw new InternalServerErrorException();
        }
      }
    }
  }

  @Post('/logout')
  @ProtectedEndpoint('Logout user')
  @UseGuards(JwtAuthGuard)
  public async logout(@Ctx() ctx: Context, @Req() req: Request) {
    try {
      const accessToken = req.headers.authorization?.replace('Bearer ', '');

      if (!accessToken) {
        throw new UnauthorizedException('Access token not found');
      }

      await this.logoutUseCase.execute(ctx, accessToken);

      return {
        message: 'Logged out successfully',
      };
    } catch (error) {
      switch (error.name) {
        case 'InvalidCredentialsException': {
          throw new UnauthorizedException(new InvalidCredentialsException());
        }
        default: {
          throw new InternalServerErrorException();
        }
      }
    }
  }

  @Get('/me')
  @ProtectedEndpoint('Get current user')
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @RequirePermissions(['Auth:GetMe'])
  public async me(@Ctx() ctx: Context, @Req() req: Request) {
    try {
      return await this.meUseCase.execute(ctx, req.user?.sub as string);
    } catch (error) {
      // NOSONAR - S1301 switch without default case
      switch (error.constructor.name) {
        case 'UserNotConfirmedException': {
          throw new ConflictException(new UserNotConfirmedException());
        }
        case 'InvalidCredentialsException': {
          throw new UnauthorizedException(new InvalidCredentialsException());
        }
        case 'UserNotFoundException': {
          throw new UnauthorizedException(new InvalidCredentialsException());
        }
        default: {
          throw new InternalServerErrorException();
        }
      }
    }
  }

  @Get('/me/permissions')
  @ProtectedEndpoint('Get current user permissions')
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @RequirePermissions(['Auth:GetMe'])
  public async getMyPermissions(@Ctx() ctx: Context, @Req() req: Request) {
    try {
      return await this.getUserPermissionsUseCase.execute(
        ctx,
        req.user?.sub as string,
      );
    } catch (error) {
      // NOSONAR - S1301 switch without default case
      switch (error.constructor.name) {
        case 'InvalidCredentialsException': {
          throw new UnauthorizedException(new InvalidCredentialsException());
        }
        default: {
          throw new InternalServerErrorException();
        }
      }
    }
  }

  @Get('/me/extras')
  @ProtectedEndpoint('Get current user extras')
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @RequirePermissions(['Auth:GetMe'])
  public async getMyExtras(@Ctx() ctx: Context, @Req() req: Request) {
    try {
      return await this.getUserExtrasUseCase.execute(
        ctx,
        req.user?.sub as string,
      );
    } catch (error) {
      // NOSONAR - S1301 switch without default case
      switch (error.constructor.name) {
        case 'InvalidCredentialsException': {
          throw new UnauthorizedException(new InvalidCredentialsException());
        }
        default: {
          throw new InternalServerErrorException();
        }
      }
    }
  }

  @Post('/refresh')
  @ProtectedEndpoint('Refresh access token', { body: RefreshTokenDto })
  @UseGuards(JwtAuthGuard)
  public async refresh(
    @Ctx() ctx: Context,
    @Req() req: Request,
    @Body() body: RefreshTokenDto,
  ) {
    try {
      // Get identityId from request.user since @Ctx() captures context before guard updates it
      const identityId = req.user?.identityId;
      return await this.refreshTokenUseCase.execute(
        ctx,
        body.refreshToken,
        identityId,
      );
    } catch (error) {
      // NOSONAR - S1301 switch without default case
      switch (error.name) {
        case 'InvalidCredentialsException': {
          throw new UnauthorizedException(new InvalidCredentialsException());
        }
        default: {
          throw new InternalServerErrorException();
        }
      }
    }
  }
}
