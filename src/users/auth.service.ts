import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { emit } from 'process';
import { promisify } from 'util';
import { randomBytes, scrypt } from 'crypto';
import { ReturningResultsEntityUpdator } from 'typeorm/query-builder/ReturningResultsEntityUpdator.js';
import { CreateUserDto } from './dto/create-user.dto';

const _scrypt = promisify(scrypt);

@Injectable()
export class AuthService {
  constructor(private readonly _userService: UsersService) {}

  async singUp(createUserDto: CreateUserDto) {
    const userinuse = await this._userService.findByEmail(createUserDto.email);

    if (userinuse) throw new BadRequestException('email in use');

    const salt = randomBytes(8).toString('hex');

    const hash = (await _scrypt(createUserDto.password, salt, 32)) as Buffer;

    const result = salt + '.' + hash.toString('hex');

    const user = await this._userService.create({
      email: createUserDto.email,
      password: result,
    });

    return user;
  }

  async singin(dto: CreateUserDto) {
    const user = await this._userService.findByEmail(dto.email);

    if (!user) throw new NotFoundException('user not found');

    const [salt, storedhash] = user.password.split('.');

    const hash = (await _scrypt(dto. password, salt, 32)) as Buffer;

    if (storedhash === hash.toString('hex')) {
      return user;
    } else {
      throw new BadRequestException('bad password');
    }
  }
}
