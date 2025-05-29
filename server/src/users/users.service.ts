import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  findOne(username: string) {
    return this.usersRepository.findOne({ where: { username } });
  }

  async create(username: string, password: string) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.usersRepository.create({
      username,
      password: hashedPassword,
    });
    return this.usersRepository.save(user);
  }

  async createAdminUserIfNotExists(): Promise<{
    username: string;
    password: string;
  } | null> {
    const adminUsername = 'admin';
    const existingAdmin = await this.findOne(adminUsername);
    if (!existingAdmin) {
      const randomPassword = randomBytes(16).toString('base64url');
      await this.create(adminUsername, randomPassword);
      return { username: adminUsername, password: randomPassword };
    }
    return null;
  }
}
