import { HttpException } from '@nestjs/common/exceptions/http.exception';
import { NestMiddleware, HttpStatus, Injectable } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { SECRET } from '../../../config';
import { PasswordsService } from './passwords.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly passwordsService: PasswordsService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const authHeaders = req.headers.authorization;
    if (authHeaders && (authHeaders as string).split(' ')[1]) {
      const token = (authHeaders as string).split(' ')[1];
      const decoded: any = jwt.verify(token, SECRET);
      const password = await this.passwordsService.findOne(decoded.id);


      if (!password) {
        throw new HttpException('Password not found.', HttpStatus.UNAUTHORIZED);
      }

      req.user = password.role
      next();

    } else {
      throw new HttpException('Not authorized.', HttpStatus.UNAUTHORIZED);
    }
  }
}