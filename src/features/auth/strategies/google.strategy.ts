import { Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback, Profile } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

import { AuthService } from '../auth.service';
import { User } from '../../users/user.entity';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  private readonly logger = new Logger(GoogleStrategy.name);

  constructor(
    configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      clientID: configService.get<string>('GOOGLE_CLIENT_ID'),
      clientSecret: configService.get<string>('GOOGLE_CLIENT_SECRET'),
      callbackURL: configService.get<string>('GOOGLE_CALLBACK_URL'),
      scope: ['email', 'profile'],
      state: true, // Enable state parameter for CSRF protection
      passReqToCallback: true, // Pass request to callback
    });
  }

  async validate(
    request: Request,
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ): Promise<void> {
    try {
      const { name, emails, photos, id } = profile;

      if (!emails || emails.length === 0) {
        this.logger.error('Google profile missing email');
        return done(new Error('Google profile missing email'), null);
      }

      const userDetails = {
        email: emails[0].value,
        name: name
          ? `${name.givenName || ''} ${name.familyName || ''}`.trim()
          : 'Google User',
        pictureUrl: photos && photos.length > 0 ? photos[0].value : null,
        providerId: id,
      };

      const authenticatedUser: User =
        await this.authService.validateOAuthUser(userDetails);
      done(null, authenticatedUser);
    } catch (error: unknown) {
      // Log error with type checking
      this.logger.error(
        `Error validating Google user: ${error instanceof Error ? error.message : 'Unknown error'}`,
        error instanceof Error ? error.stack : undefined,
      );
      done(error as Error, null);
    }
  }
}
