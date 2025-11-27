import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { SafeUserDto } from './dto/safe-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  private toSafeUser(user: User): SafeUserDto {
    const { password, ...safeUser } = user;
    return safeUser;
  }

  async create(createUserDto: CreateUserDto): Promise<SafeUserDto> {
    const { password, ...userData } = createUserDto;

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await this.userRepository.save({
      ...userData,
      password: hashedPassword,
    });
    return this.toSafeUser(newUser);
  }

  async findAll(): Promise<SafeUserDto[]> {
    const users = await this.userRepository.find();
    return users.map((user) => this.toSafeUser(user));
  }

  async findOne(id: string): Promise<SafeUserDto> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return this.toSafeUser(user);
  }

  async findByUsername(username: string): Promise<User | null> {
    return await this.userRepository.findOne({ where: { username } });
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<SafeUserDto> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    const updateData = { ...updateUserDto };

    if (updateUserDto.password) {
      updateData.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    await this.userRepository.update(id, updateData);
    const updatedUser = await this.userRepository.findOne({ where: { id } });
    return this.toSafeUser(updatedUser);
  }

  async remove(id: string): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    await this.userRepository.delete(id);
  }
}
