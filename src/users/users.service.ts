import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}
  async create(createUserDto: CreateUserDto) {
    const { name, email, password, cpf } = createUserDto;
    const passwordCrypted = await bcrypt.hash(password, 10);

    const userWithSameEmail = await this.prisma.user.findUnique({
      where: { email },
    });

    const userWithSameCpf = await this.prisma.user.findUnique({
      where: { cpf },
    });

    if (userWithSameCpf || userWithSameEmail) {
      throw new Error('This user already exists.');
    }

    await this.prisma.user.create({
      data: {
        name,
        email,
        password: passwordCrypted,
        cpf,
      },
    });
    return 'User Created';
  }

  findAll() {
    return `This action returns all users`;
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (user == null) {
      throw new Error("User don't found.");
    }
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const { name, password } = updateUserDto;

    const updateData: any = { name };

    if (password != null) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    await this.prisma.user.update({
      where: { id },
      data: updateData,
    });
    return `User Updated`;
  }

  async remove(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (user == null) {
      throw new Error("User don't exist");
    }

    await this.prisma.user.delete({
      where: { id },
    });
    return `User Deleted`;
  }
}
