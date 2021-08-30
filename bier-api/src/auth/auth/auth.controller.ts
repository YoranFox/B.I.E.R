import { Controller, Param, Post, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Public } from 'src/decorators/public.decorator';
import { AuthService } from './auth.service';
import { LoginResponseDto } from './dto/login-response.dto';

@ApiTags('AuthApi')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login/:code')
  loginWithCode(
    @Param('code') code: string,
    @Req() req: any,
  ): Promise<LoginResponseDto> {
    return this.authService.loginWithCode(code, req.ip);
  }
}
