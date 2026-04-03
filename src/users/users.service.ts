import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { NotFoundError } from 'rxjs';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private _repoUser: Repository<User>) {}

  create(createUserDto: CreateUserDto) {
    const userReult = this._repoUser.create(createUserDto);

    return this._repoUser.save(userReult);
  }

  find() {
    return this._repoUser.find();
  }

  async findOne(id: number) {

    if(!id) return null
    return await this._repoUser.findOne({
      where: {
        id,
      },
    });
  }

  async findByEmail(email: string) {
    return await this._repoUser.findOne({ where: { email: email } });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this._repoUser.findOne({
      where: {
        id,
      },
    });

    if (!user) throw new NotFoundException('user Not found');

    Object.assign(user, updateUserDto);

    return this._repoUser.save(user);
  }

  async remove(id: number) {
    const user = await this._repoUser.findOne({ where: { id } });
    if (!user) throw new NotFoundException('user Not found');

    return await this._repoUser.remove(user);
  }
}
