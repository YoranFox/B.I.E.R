import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Public } from 'src/decorators/public.decorator';
import { AuthService } from './auth.service';
import { LoginResponseDto } from './dto/login-response.dto';
import { LoginCreatorDto } from './dto/login.dto';

@ApiTags('AuthApi')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('join/:code')
  loginWithCode(
    @Param('code') code: string,
    @Req() req: any,
  ): Promise<LoginResponseDto> {
    return this.authService.loginWithCode(code, req.ip);
  }

  @Public()
  @Post('login')
  loginAsCreator(
    @Body() loginDto: LoginCreatorDto,
    @Req() req: any,
  ): Promise<LoginResponseDto> {
    return this.authService.loginAsCreator(loginDto, req.ip);
  }

  @Get('')
  isAuthenticated() {
    return true;
  }
}
