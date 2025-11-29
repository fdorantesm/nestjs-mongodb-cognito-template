import { UserException } from './user.exception';
import { UserErrorCode } from '@/modules/users/domain/enums/user-error-codes.enum';
import { HttpStatus } from '@nestjs/common';

export class UserNotFoundException extends UserException {
  constructor(userId?: string, context?: Record<string, any>) {
    super(
      UserErrorCode.USERS_USER_NOT_FOUND_001,
      userId ? `User ${userId} not found` : 'User not found',
      HttpStatus.NOT_FOUND,
      { ...context, userId },
    );
  }
}
