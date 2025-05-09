import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import bcrypt from 'bcryptjs';

import { UsersService } from '../users/users.service';
import { User, AuthProvider } from '../users/user.entity';

import { LoginDto, RegisterDto, TokensDto } from './dto/auth.dto';
import { JwtPayload } from './strategies/jwt.strategy';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(registerDto: RegisterDto): Promise<TokensDto> {
    const existingUser = await this.usersService.findByEmail(registerDto.email);
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const user = await this.usersService.create({
      email: registerDto.email,
      name: registerDto.name,
      password: registerDto.password,
    });

    return this.generateTokens(user);
  }

  async login(loginDto: LoginDto): Promise<TokensDto> {
    const user = await this.usersService.findByEmailWithPassword(
      loginDto.email,
    );
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.generateTokens(user);
  }

  async refreshTokens(
    userId: number,
    refreshToken: string,
  ): Promise<TokensDto> {
    const user = await this.usersService.findOne(userId);

    if (!user || !user.refreshToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const isRefreshTokenMatching = await bcrypt.compare(
      refreshToken,
      user.refreshToken,
    );

    if (!isRefreshTokenMatching) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    return this.generateTokens(user);
  }

  async logout(userId: number): Promise<void> {
    await this.usersService.updateRefreshToken(userId, null);
  }

  async validateOAuthUser(userDetails: {
    email: string;
    name: string;
    pictureUrl: string;
    providerId: string;
  }): Promise<User> {
    const { email, name, pictureUrl, providerId } = userDetails;
    let user = await this.usersService.findByEmail(email);

    if (user) {
      // If user exists but was registered through a different method
      if (user.provider !== AuthProvider.GOOGLE) {
        // Update user to link with Google account
        user = await this.usersService.update(user.id, {
          provider: AuthProvider.GOOGLE,
          providerId,
          pictureUrl,
          // Don't update name if it already exists
          ...(user.name ? {} : { name }),
        });
      } else {
        // Update existing Google user with latest info
        user = await this.usersService.update(user.id, {
          pictureUrl,
          providerId,
        });
      }
    } else {
      // Create a new user if they don't exist
      user = await this.usersService.create({
        email,
        name,
        pictureUrl,
        provider: AuthProvider.GOOGLE,
        providerId,
      });
    }

    return user;
  }

  // Changed from private to public so it can be used in the controller
  async generateTokens(user: User): Promise<TokensDto> {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_SECRET'),
        expiresIn: '15m',
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: '7d',
      }),
    ]);

    // Hash refresh token before storing it
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.usersService.updateRefreshToken(user.id, hashedRefreshToken);

    return {
      accessToken,
      refreshToken,
    };
  }
}
