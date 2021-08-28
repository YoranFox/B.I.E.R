import { Controller, Inject, Injectable, Param, Post,  Req,  Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { ApiTags } from '@nestjs/swagger';
import { Public } from 'src/decorators/public.decorator';
import { AuthService } from './auth.service';
import { LoginResponseDto } from './dto/login-response.dto';
import { Request } from 'express';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService
    ) {}

  @Public()
  @Post('login/:code')
  loginWithCode(@Param('code') code: string, @Req() req: any): Promise<LoginResponseDto> {
    return this.authService.loginWithCode(code, req.ip);
  }
}
