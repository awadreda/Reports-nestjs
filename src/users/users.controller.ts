import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  ClassSerializerInterceptor,
  Session,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiCookieAuth } from '@nestjs/swagger';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { UserDto } from './dto/user.dto';
import { AuthService } from './auth.service';
import { User } from './entities/user.entity';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('user')
@Serialize(UserDto)
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly _authServise: AuthService,
  ) {}

  @ApiCookieAuth()
  @Post('/signup')
  async createUser(
    @Body() createUserDto: CreateUserDto,
    @Session() session: any,
  ) {
    const user = await this._authServise.singUp(createUserDto);
    session.userId = user.id;
  }

  @ApiCookieAuth()
  @Post('/sginin')
  async signin(@Body() body: CreateUserDto, @Session() session: any) {
    const user = await this._authServise.singin(body);
    session.userId = user.id;
    return user;
  }

  @UseGuards(AuthGuard)
  @Get('/whoami')
  whoAmI(@CurrentUser() user: User) {
    return user;
  }

  @Post('/signOut')
  sginOut(@Session() session: any) {
    session.userId = null;
  }
  @Get('/colors/:color')
  setColor(@Param('color') color: string, @Session() session: any) {
    session.color = color;
  }

  @Get('/color')
  getColor(@Session() session: any) {
    return session.color;
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  // @UseInterceptors(new SerializeInterceptor(UserDto))
  @Get(':id')
  findOne(@Param('id') id: string) {
    console.log('the get id request');
    return this.usersService.findOne(parseInt(id));
  }

  @Patch('UpdateUser:id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete('DeleteUser:id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
