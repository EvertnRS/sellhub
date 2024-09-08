import { IsEmail, IsNotEmpty, Length, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @Length(5, 150)
  name: string;
  @IsNotEmpty()
  @IsEmail()
  email: string;
  @IsNotEmpty()
  @MinLength(8, {
    message: 'The password has less than 8 characters.',
  })
  password: string;
  @Length(11)
  cpf: number;
}
