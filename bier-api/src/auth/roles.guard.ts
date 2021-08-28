import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext) {
        const roles = this.reflector.get<string[]>('roles', context.getHandler());

        if(!roles) {
            return true;
        }

        const request = context.switchToHttp().getRequest();
        const session = request.user;

        if(!session || !session.user) {
            return false;
        }

        const role = session.code.role;

        return roles.some((r) => {
            if(r === role) {
                return true;
            }
        });
    }
}