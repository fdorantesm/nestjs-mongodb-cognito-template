import { InvalidCredentialsException } from '@/core/domain/exceptions/invalid-credentials';
import { UserNotConfirmedException } from '@/core/domain/exceptions/user-not-confirmed';
import {
  CognitoIdentityProviderClient,
  ConfirmSignUpCommand,
  InitiateAuthCommand,
  RespondToAuthChallengeCommand,
  SignUpCommand,
} from '@aws-sdk/client-cognito-identity-provider';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import * as jwt from 'jsonwebtoken';
import * as jwksClient from 'jwks-rsa';

@Injectable()
export class IdentityService {
  private client: CognitoIdentityProviderClient;
  private config: any;

  constructor(private readonly configService: ConfigService) {
    this.config = this.configService.get('cognito');
    this.client = new CognitoIdentityProviderClient({
      region: this.config.region,
    });
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
            idToken: response.AuthenticationResult.IdToken,
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
            idToken: response.AuthenticationResult.IdToken,
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
    const response = await this.client.send(
      new SignUpCommand({
        ClientId: this.config.clientId,
        SecretHash: await this.getSecretHash(payload.email),
        Username: payload.email,
        Password: payload.password,
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
          // eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors
          if (err) return reject(err);
          resolve(decoded);
        },
      );
    });
  }

  private getSecretHash(email: string): Promise<string> {
    const { clientSecret, clientId } = this.config;
    const hmac = crypto.createHmac('SHA256', clientSecret);
    hmac.update(email + clientId);
    return Promise.resolve(hmac.digest('base64'));
  }
}
