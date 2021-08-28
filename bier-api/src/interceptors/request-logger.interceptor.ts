import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from "@nestjs/common";
import { Observable, tap } from "rxjs";

@Injectable()
export class RequestLogger implements NestInterceptor {

    private readonly logger = new Logger(RequestLogger.name);

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {

      const request = context.switchToHttp().getRequest()
        
      const now = Date.now();
      return next
        .handle()
        .pipe(
          tap(() => this.logger.log(`${request.method} \t ${request.url} \t ${Date.now() - now}ms`)),
        );
    }
}