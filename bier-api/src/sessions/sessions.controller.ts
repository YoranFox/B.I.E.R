import { Controller, Get, Post, Body, Patch, Param, Delete, Injectable, Scope, Inject, Req } from '@nestjs/common';
import { SessionsService } from './sessions.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Session } from './entities/session.entity';

@ApiTags('Sessions')
@ApiBearerAuth()
@Controller('sessions')
export class SessionsController {
  constructor(private readonly sessionsService: SessionsService) {}

  @Delete('user')
  removeUserFromSession(@Req() req: any) {
    return this.sessionsService.removeUser(req.user)
  }
 
  @Post('user/:userId')
  selectUserForSession(@Param('userId') userId: string, @Req() req: any) {
    return this.sessionsService.setUser(req.user, userId);
  }

  @Get('')
  findAll(): Promise<Session[]> {
    return this.sessionsService.findAll();
  }
}
