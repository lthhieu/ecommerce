import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { genSaltSync, hashSync } from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) { }
  hashPassword(plaintext: string) {
    const salt = genSaltSync(10);
    return hashSync(plaintext, salt);
  }
  async create(createUserDto: CreateUserDto) {
    //check mail exist
    let check = await this.userModel.findOne({ email: createUserDto.email })
    if (check) {
      throw new BadRequestException('Email is existed')
    }
    //create
    let createNewUser = this.userModel.create({
      ...createUserDto,
      password: this.hashPassword(createUserDto.password)
    })
    return {
      _id: (await createNewUser)._id
    }
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
