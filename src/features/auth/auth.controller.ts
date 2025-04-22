import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  Get,
  Req,
  Res,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiOkResponse,
  ApiCreatedResponse,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';

import { User } from '../users/user.entity';

import { AuthService } from './auth.service';
import { LoginDto, RegisterDto, TokensDto } from './dto/auth.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
import { User as UserDecorator } from './decorators/user.decorator';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register new user' })
  @ApiBody({
    type: RegisterDto,
    examples: {
      example1: {
        value: {
          email: 'user@example.com',
          name: 'John Doe',
          password: 'Password123!',
        },
        summary: 'Register a new user',
      },
    },
  })
  @ApiCreatedResponse({
    type: TokensDto,
    description: 'User registered successfully',
    content: {
      'application/json': {
        example: {
          accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
          refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        },
      },
    },
  })
  async register(@Body() registerDto: RegisterDto): Promise<TokensDto> {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'User login' })
  @ApiBody({
    type: LoginDto,
    examples: {
      example1: {
        value: {
          email: 'user@example.com',
          password: 'Password123!',
        },
        summary: 'Login with credentials',
      },
    },
  })
  @ApiOkResponse({
    type: TokensDto,
    description: 'Login successful',
    content: {
      'application/json': {
        example: {
          accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
          refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        },
      },
    },
  })
  async login(@Body() loginDto: LoginDto): Promise<TokensDto> {
    return this.authService.login(loginDto);
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({
    summary: 'Login with Google',
    description:
      "Initiates Google OAuth authentication flow. Redirects the user to Google's authentication page.",
  })
  @ApiOkResponse({
    description: 'Redirect to Google Authentication',
    content: {
      'text/html': {
        schema: {
          type: 'string',
          description: 'HTML redirect to Google login page',
        },
      },
    },
  })
  async googleAuth() {
    // This endpoint initiates Google OAuth flow
    // The guard will redirect to Google authentication page
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({
    summary: 'Google OAuth callback',
    description:
      'Handles the callback from Google OAuth. Redirects to frontend with authentication tokens.',
  })
  @ApiOkResponse({
    description: 'Redirect to frontend with tokens',
    content: {
      'text/html': {
        schema: {
          type: 'string',
          description: 'HTML redirect to frontend callback URL with tokens',
        },
      },
    },
  })
  async googleAuthCallback(@Req() req: Request, @Res() res: Response) {
    try {
      const { user } = req as Request & { user: User };
      if (!user) {
        const frontendUrl = this.configService.get<string>('FRONTEND_URL');
        return res.redirect(
          `${frontendUrl}/auth/error?error=authentication_failed`,
        );
      }

      const tokens = await this.authService.generateTokens(user);
      const frontendUrl = this.configService.get<string>('FRONTEND_URL');

      // Set refresh token in HttpOnly cookie
      res.cookie('refresh_token', tokens.refreshToken, {
        httpOnly: true,
        secure: this.configService.get('NODE_ENV') === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        path: '/auth/refresh',
      });

      // Only pass access token in URL (short-lived)
      return res.redirect(
        `${frontendUrl}/auth/callback?access_token=${tokens.accessToken}`,
      );
    } catch (error) {
      console.error('Google auth callback error:', error);
      const frontendUrl = this.configService.get<string>('FRONTEND_URL');
      return res.redirect(`${frontendUrl}/auth/error?error=server_error`);
    }
  }

  @UseGuards(JwtRefreshGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiOkResponse({
    description: 'Access token refreshed successfully',
    content: {
      'application/json': {
        example: {
          accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        },
      },
    },
  })
  async refreshTokens(
    @UserDecorator('id') userId: number,
    @UserDecorator('refreshToken') refreshToken: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ accessToken: string }> {
    const tokens = await this.authService.refreshTokens(userId, refreshToken);

    // Update the refresh token cookie
    res.cookie('refresh_token', tokens.refreshToken, {
      httpOnly: true,
      secure: this.configService.get('NODE_ENV') === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: '/auth/refresh',
    });

    // Only return the access token in the response body
    return { accessToken: tokens.accessToken };
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'User logout' })
  @ApiOkResponse({
    description: 'Logout successful',
    content: {
      'application/json': {
        example: {},
      },
    },
  })
  async logout(
    @UserDecorator('id') userId: number,
    @Res({ passthrough: true }) res: Response,
  ): Promise<void> {
    await this.authService.logout(userId);

    // Clear the refresh token cookie
    res.cookie('refresh_token', '', {
      httpOnly: true,
      secure: this.configService.get('NODE_ENV') === 'production',
      sameSite: 'lax',
      expires: new Date(0),
      path: '/auth/refresh',
    });
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @ApiOperation({ summary: 'Get user profile' })
  @ApiOkResponse({
    description: 'User profile retrieved successfully',
    content: {
      'application/json': {
        example: {
          id: 1,
          email: 'user@example.com',
          name: 'John Doe',
          role: 'user',
          provider: 'google',
          pictureUrl:
            'https://lh3.googleusercontent.com/a-/AOh14Gi0DgItGDTATTFOapkhPBuz_z-I35W...',
          isActive: true,
        },
      },
    },
  })
  getProfile(@UserDecorator() user: User) {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      provider: user.provider,
      pictureUrl: user.pictureUrl,
      isActive: user.isActive,
    };
  }
}
