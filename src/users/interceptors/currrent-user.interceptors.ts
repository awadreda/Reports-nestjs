import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { UsersService } from '../users.service';

@Injectable()
export class CurrentUserInterceptor implements NestInterceptor {
  constructor(private readonly _userSevice: UsersService) {}

  async intercept(context: ExecutionContext, handler: CallHandler) {
    const request = context.switchToHttp().getRequest();

    const  userId  = request.session.userId;

    if (userId) {
      const user = await this._userSevice.findOne(Number(userId));

      request.currentUser = user;
    }

    return handler.handle();
  }
}
