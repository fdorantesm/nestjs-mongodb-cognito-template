import {
  Controller,
  Get,
  UseGuards,
  Request,
  Body,
  Post,
  UnauthorizedException,
  InternalServerErrorException,
  ConflictException,
} from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';

import type { Context } from '@/core/domain/interfaces/context.interface';
import { Ctx } from '@/core/infrastructure/decorators/context.decorator';
import { RegisterUseCase } from '@/modules/auth/application/use-cases/register.use-case';
import { JwtAuthGuard } from '@/modules/auth/infrastructure/guards/jwt.auth.guard';
import { ChallengeDto } from '@/modules/auth/infrastructure/http/dtos/challenge.dto';
import { ConfirmRegisterDto } from '@/modules/auth/infrastructure/http/dtos/confirm-register.dto';
import { LoginDto } from '@/modules/auth/infrastructure/http/dtos/login.dto';
import { RegistrationDto } from '@/modules/auth/infrastructure/http/dtos/register.dto';
import { UserNotConfirmedException } from '@/core/domain/exceptions/user-not-confirmed';
import { InvalidCredentialsException } from '@/core/domain/exceptions/invalid-credentials';
import { ConfirmRegisterUseCase } from '@/modules/auth/application/use-cases/confirm-register.use-case';
import { LoginUseCase } from '@/modules/auth/application/use-cases/login.use-case';
import { UserAlreadyConfirmedException } from '@/modules/auth/domain/exceptions/user-already-confirmed.exception';
import { UserAlreadyRegisteredException } from '@/modules/auth/domain/exceptions/user-already-registered.exception';
import { RespondChallengeUseCase } from '@/modules/auth/application/use-cases/respond-challenge.use-case';
import { MeUseCase } from '@/modules/auth/application/use-cases/me.use-case';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly registerUseCase: RegisterUseCase,
    private readonly confirmRegisterUseCase: ConfirmRegisterUseCase,
    private readonly respondChallengeUseCase: RespondChallengeUseCase,
    private readonly meUseCase: MeUseCase,
  ) {}

  @Post('register')
  @ApiBody({ type: RegistrationDto })
  public async register(
    @Ctx() context: Context,
    @Body() body: RegistrationDto,
  ) {
    try {
      await this.registerUseCase.execute(context, body);

      return {
        message: 'User registered successfully',
      };
    } catch (error) {
      switch (error.constructor.name) {
        case 'UserAlreadyRegisteredException': {
          throw new ConflictException(new UserAlreadyRegisteredException());
        }
        default: {
          throw new InternalServerErrorException();
        }
      }
    }
  }

  @Post('confirm-register')
  @ApiBody({ type: ConfirmRegisterDto })
  public async registerConfirm(
    @Ctx() ctx: Context,
    @Body() body: ConfirmRegisterDto,
  ) {
    try {
      await this.confirmRegisterUseCase.execute(
        ctx,
        body.email,
        body.confirmationCode,
      );

      return {
        message: 'User confirmed successfully',
      };
    } catch (error) {
      switch (error.constructor.name) {
        case 'UserAlreadyConfirmedException': {
          throw new ConflictException(new UserAlreadyConfirmedException());
        }
        case 'InvalidCredentialsException': {
          throw new UnauthorizedException(new InvalidCredentialsException());
        }
        default: {
          throw new InternalServerErrorException();
        }
      }
    }
  }

  @Post('login')
  @ApiBody({ type: LoginDto })
  public async login(@Ctx() ctx: Context, @Body() body: LoginDto) {
    try {
      return await this.loginUseCase.execute(ctx, body.email, body.password);
    } catch (error) {
      console.log('error', error);
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

  @ApiBody({ type: ChallengeDto })
  @Post('/challenge')
  public async challenge(@Ctx() ctx: Context, @Body() body: ChallengeDto) {
    try {
      return await this.respondChallengeUseCase.execute(ctx, body);
    } catch (error) {
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

  @Get('/me')
  @UseGuards(JwtAuthGuard)
  public async me(@Ctx() ctx: Context, @Request() req: any) {
    try {
      return await this.meUseCase.execute(ctx, req.user.sub);
    } catch (error) {
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
}
