import { ExecutionContext, Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AuthGuard } from "@nestjs/passport";
import { IS_PUBLIC_KEY } from "src/decorators/public.decorator";
import { SessionsService } from "src/sessions/sessions.service";

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    constructor(private reflector: Reflector) {
        super();
    }

    canActivate(context: ExecutionContext) {
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass()
        ]);

        if(isPublic) {
            return true;
        }
        
        return super.canActivate(context)
    }

    handleRequest(err, session, info: Error) {   
        
        if(err || info || !session) {
            throw new UnauthorizedException('Invalid authentication');
        }

        if(session.code.endDate < new Date()){
            throw new UnauthorizedException('Code expired')
        }

        return session;
    }
}