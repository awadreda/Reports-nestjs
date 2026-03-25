import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, isPassportNumber, isString } from 'class-validator';

export class CreateUserDto {
  @ApiProperty()
  @IsEmail()
  email: string;
  @ApiProperty()
  @IsString()
  password: string;
}
