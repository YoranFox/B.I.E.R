import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { UserRole } from "src/enums/roles.enum";

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext) {
        const roles = this.reflector.get<string[]>('roles', context.getHandler());

        const request = context.switchToHttp().getRequest();
        const session = request.user;
        
        console.log(request.params);
        

        if(!roles) {
            return true;
        }

        if(!session) {
            return false;
        }

        let role = null;

        if(session.user) {
            role = UserRole.USER;
        }

        if(session.creator) {
            role = UserRole.CREATOR;
        }

        return roles.some((r) => {
            if(r === role) {
                return true;
            }
        });
    }
}