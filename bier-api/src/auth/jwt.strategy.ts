import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { SessionsService } from "src/sessions/sessions.service";
import { UsersService } from "src/users/users.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(private readonly sessionService: SessionsService) {
        super({
                jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
                secretOrKey: process.env.JWT_SECRET_KEY,
        });
    }

    async validate(payload, done) {
        try {
            const session = await this.sessionService.findOne(payload.sessionId);
            this.sessionService.updateLastActive(session)
            done(null, session)
        }
        catch(err) {
            throw new UnauthorizedException('Unautherized', err.message)
        }
    }
}