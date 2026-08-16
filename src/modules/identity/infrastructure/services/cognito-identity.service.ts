import {
  AdminCreateUserCommand,
  AdminDeleteUserCommand,
  AdminDisableUserCommand,
  AdminEnableUserCommand,
  AdminGetUserCommand,
  AdminSetUserPasswordCommand,
  AdminUpdateUserAttributesCommand,
  AttributeType,
  CognitoIdentityProviderClient,
  ConfirmSignUpCommand,
  GlobalSignOutCommand,
  InitiateAuthCommand,
  RespondToAuthChallengeCommand,
  SignUpCommand,
} from '@aws-sdk/client-cognito-identity-provider';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'node:crypto';
import * as jwt from 'jsonwebtoken';
// eslint-disable-next-line @typescript-eslint/no-require-imports
import jwksClient = require('jwks-rsa');

import { InvalidCredentialsException } from '@/core/domain/exceptions/invalid-credentials';
import { UserNotConfirmedException } from '@/core/domain/exceptions/user-not-confirmed';
import type {
  CreateIdentityUserInput,
  CreateIdentityUserResult,
  IdentityUser,
  UpdateIdentityUserInput,
} from '@/modules/identity/domain/types/identity-user.types';
import type { IdentityUserAttributes } from '@/modules/identity/domain/types/identity-user-attributes.type';
import type { IdentityService } from '@/modules/identity/domain/interfaces/identity.service.interface';
import { Service } from '@/core/application/service.decorator';

@Service()
export class CognitoIdentityService implements IdentityService {
  private readonly client: CognitoIdentityProviderClient;
  private readonly config: any;

  constructor(private readonly configService: ConfigService) {
    this.config = this.configService.get('cognito');
    this.client = new CognitoIdentityProviderClient({
      region: this.config.region,
    });
  }

  private mapAttributes(attributes?: IdentityUserAttributes): AttributeType[] {
    if (!attributes) {
      return [];
    }

    return Object.entries(attributes)
      .filter(([, value]) => value !== undefined)
      .map(([Name, Value]) => ({ Name, Value: String(Value) }));
  }

  public async createUser(
    input: CreateIdentityUserInput,
  ): Promise<CreateIdentityUserResult> {
    const temporaryPassword =
      input.temporaryPassword ?? this.generateSecurePassword();

    const command = new AdminCreateUserCommand({
      UserPoolId: this.config.userPoolId,
      Username: input.email,
      TemporaryPassword: temporaryPassword,
      UserAttributes: this.mapAttributes({
        email: input.email,
        name: input.name,
        phone_number: input.phone,
        email_verified: true,
        ...input.attributes,
      }),
      MessageAction: input.suppressInvitation ? 'SUPPRESS' : undefined,
      ForceAliasCreation: false,
      DesiredDeliveryMediums: ['EMAIL'],
    });

    const response = await this.client.send(command);

    if (input.password) {
      await this.client.send(
        new AdminSetUserPasswordCommand({
          UserPoolId: this.config.userPoolId,
          Username: input.email,
          Password: input.password,
          Permanent: true,
        }),
      );
    }

    if (input.enabled === false) {
      await this.client.send(
        new AdminDisableUserCommand({
          UserPoolId: this.config.userPoolId,
          Username: input.email,
        }),
      );
    }

    const username = response.User?.Username ?? input.email;

    return {
      identityId: username,
      username,
      temporaryPassword: input.password ? undefined : temporaryPassword,
    };
  }

  public async updateUser(input: UpdateIdentityUserInput): Promise<void> {
    if (input.attributes) {
      await this.client.send(
        new AdminUpdateUserAttributesCommand({
          UserPoolId: this.config.userPoolId,
          Username: input.username,
          UserAttributes: this.mapAttributes(input.attributes),
        }),
      );
    }

    if (input.password) {
      await this.client.send(
        new AdminSetUserPasswordCommand({
          UserPoolId: this.config.userPoolId,
          Username: input.username,
          Password: input.password,
          Permanent: true,
        }),
      );
    }

    if (input.enabled !== undefined) {
      await this.client.send(
        input.enabled
          ? new AdminEnableUserCommand({
              UserPoolId: this.config.userPoolId,
              Username: input.username,
            })
          : new AdminDisableUserCommand({
              UserPoolId: this.config.userPoolId,
              Username: input.username,
            }),
      );
    }
  }

  public async deleteUser(username: string): Promise<void> {
    await this.client.send(
      new AdminDeleteUserCommand({
        UserPoolId: this.config.userPoolId,
        Username: username,
      }),
    );
  }

  public async getUser(username: string): Promise<IdentityUser> {
    const response = await this.client.send(
      new AdminGetUserCommand({
        UserPoolId: this.config.userPoolId,
        Username: username,
      }),
    );

    const attributes: Record<string, string> = {};

    response.UserAttributes?.forEach((attribute) => {
      attributes[attribute.Name] = attribute.Value;
    });

    return {
      username: response.Username,
      identityId: response.Username,
      enabled: response.Enabled ?? true,
      status: response.UserStatus,
      createdAt: response.UserCreateDate,
      updatedAt: response.UserLastModifiedDate,
      attributes,
    };
  }

  public async initiateAuth(username: string, password: string): Promise<any> {
    try {
      const secretHash = await this.getSecretHash(username);
      const response = await this.client.send(
        new InitiateAuthCommand({
          AuthFlow: 'USER_PASSWORD_AUTH',
          ClientId: this.config.clientId,
          AuthParameters: {
            USERNAME: username,
            PASSWORD: password,
            SECRET_HASH: secretHash,
          },
        }),
      );

      switch (response.ChallengeName) {
        case 'NEW_PASSWORD_REQUIRED':
          return {
            challengeName: response.ChallengeName,
            session: response.Session,
            username,
          };
        case 'EMAIL_OTP':
          return {
            challengeName: response.ChallengeName,
            session: response.Session,
          };
        default:
          return {
            accessToken: response.AuthenticationResult.AccessToken,
            refreshToken: response.AuthenticationResult.RefreshToken,
          };
      }
    } catch (error) {
      switch (error.name) {
        case 'UserNotConfirmedException':
          throw new UserNotConfirmedException();
        case 'NotAuthorizedException':
        case 'UserNotFoundException':
          throw new InvalidCredentialsException();
        default:
          throw error;
      }
    }
  }

  public async challenge(payload: any): Promise<any> {
    try {
      switch (payload.challengeName) {
        case 'NEW_PASSWORD_REQUIRED': {
          const secretHash = await this.getSecretHash(payload.username);
          const response = await this.client.send(
            new RespondToAuthChallengeCommand({
              ChallengeName: payload.challengeName,
              ClientId: this.config.clientId,
              ChallengeResponses: {
                USERNAME: payload.username,
                NEW_PASSWORD: payload.value,
                SECRET_HASH: secretHash,
              },
              Session: payload.session,
            }),
          );

          return {
            challengeName: response.ChallengeName,
            session: response.Session,
          };
        }
        case 'EMAIL_OTP': {
          const secretHash = await this.getSecretHash(payload.username);
          const response = await this.client.send(
            new RespondToAuthChallengeCommand({
              ChallengeName: payload.challengeName,
              ClientId: this.config.clientId,
              ChallengeResponses: {
                USERNAME: payload.username,
                SECRET_HASH: secretHash,
                EMAIL_OTP_CODE: payload.value,
              },
              Session: payload.session,
            }),
          );
          return {
            accessToken: response.AuthenticationResult.AccessToken,
            refreshToken: response.AuthenticationResult.RefreshToken,
          };
        }
        default: {
          throw new Error('Challenge not supported');
        }
      }
    } catch (error) {
      switch (error.name) {
        case 'UserNotConfirmedException':
          throw new UserNotConfirmedException();
        case 'NotAuthorizedException':
        case 'UserNotFoundException':
          throw new InvalidCredentialsException();
        default:
          throw error;
      }
    }
  }

  public async register(payload: any): Promise<any> {
    const userAttributes: AttributeType[] = [];

    if (payload.displayName) {
      userAttributes.push({
        Name: 'name',
        Value: payload.displayName,
      });
    }

    if (payload.phone) {
      userAttributes.push({
        Name: 'phone_number',
        Value: payload.phone,
      });
    }

    const response = await this.client.send(
      new SignUpCommand({
        ClientId: this.config.clientId,
        SecretHash: await this.getSecretHash(payload.email),
        Username: payload.email,
        Password: payload.password,
        UserAttributes: userAttributes.length > 0 ? userAttributes : undefined,
      }),
    );
    return response;
  }

  public async confirmRegister(payload: any): Promise<any> {
    const response = await this.client.send(
      new ConfirmSignUpCommand({
        ClientId: this.config.clientId,
        SecretHash: await this.getSecretHash(payload.email),
        Username: payload.email,
        ConfirmationCode: payload.confirmationCode,
      }),
    );

    return response;
  }

  private generateSecurePassword(length: number = 12): string {
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const digits = '0123456789';
    const symbols = '!@#$%^&*()_+{}:"<>?|[];\',./`~';
    const all = uppercase + lowercase + digits + symbols;

    let password = '';
    password += uppercase.charAt(Math.floor(Math.random() * uppercase.length));
    password += lowercase.charAt(Math.floor(Math.random() * lowercase.length));
    password += digits.charAt(Math.floor(Math.random() * digits.length));
    password += symbols.charAt(Math.floor(Math.random() * symbols.length));

    for (let i = 4; i < length; i++) {
      password += all.charAt(Math.floor(Math.random() * all.length));
    }

    return password
      .split('')
      .sort(() => 0.5 - Math.random())
      .join('');
  }

  public async validateAccessToken(token: string): Promise<any> {
    const jwksUri = `https://cognito-idp.${this.config.region}.amazonaws.com/${this.config.userPoolId}/.well-known/jwks.json`;
    const client = jwksClient({ jwksUri });

    const getKey = (header, callback) => {
      client.getSigningKey(header.kid, (err, key) => {
        if (err) return callback(err);
        const signingKey = key.getPublicKey();
        callback(null, signingKey);
      });
    };

    return new Promise((resolve, reject) => {
      jwt.verify(
        token,
        getKey,
        {
          issuer: `https://cognito-idp.${this.config.region}.amazonaws.com/${this.config.userPoolId}`,
        },
        (err, decoded) => {
          if (err) return reject(err);
          resolve(decoded);
        },
      );
    });
  }

  public async refreshToken(
    refreshToken: string,
    identityId: string,
  ): Promise<{
    accessToken: string;
    expiresIn: number;
  }> {
    try {
      // Get the username from identityId to generate SECRET_HASH
      const secretHash = await this.getSecretHash(identityId);

      const response = await this.client.send(
        new InitiateAuthCommand({
          AuthFlow: 'REFRESH_TOKEN_AUTH',
          ClientId: this.config.clientId,
          AuthParameters: {
            REFRESH_TOKEN: refreshToken,
            SECRET_HASH: secretHash,
          },
        }),
      );

      if (!response.AuthenticationResult) {
        throw new InvalidCredentialsException('Token refresh failed');
      }

      return {
        accessToken: response.AuthenticationResult.AccessToken,
        expiresIn: response.AuthenticationResult.ExpiresIn ?? 3600,
      };
    } catch (error) {
      switch (error.name) {
        case 'NotAuthorizedException':
          throw new InvalidCredentialsException(
            'Refresh token expired or invalid',
          );
        default:
          throw error;
      }
    }
  }

  public async logout(accessToken: string): Promise<void> {
    try {
      await this.client.send(
        new GlobalSignOutCommand({
          AccessToken: accessToken,
        }),
      );
    } catch (error) {
      switch (error.name) {
        case 'NotAuthorizedException':
          throw new InvalidCredentialsException('Invalid access token');
        default:
          throw error;
      }
    }
  }

  private getSecretHash(email: string): Promise<string> {
    const { clientSecret, clientId } = this.config;
    const hmac = crypto.createHmac('SHA256', clientSecret);
    hmac.update(email + clientId);
    return Promise.resolve(hmac.digest('base64'));
  }
}
