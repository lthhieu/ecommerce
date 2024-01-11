import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import mongoose, { Model } from 'mongoose';
import { genSaltSync, hashSync, compareSync } from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) { }
  hashPassword(plaintext: string) {
    const salt = genSaltSync(10);
    return hashSync(plaintext, salt);
  }
  async findOneByEmail(email: string) {
    return await this.userModel.findOne({ email })
  }
  comparePassword(pass: string, hash: string) {
    return compareSync(pass, hash)
  }
  async create(createUserDto: CreateUserDto) {
    //check mail exist
    let check = await this.findOneByEmail(createUserDto.email)
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

  findOne(id: string) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
  updateRefreshToken = async (refreshToken: string, id: string) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException('ID is invalid')
    }
    return await this.userModel.findByIdAndUpdate(id, {
      refreshToken
    })
  }
  updatePasswordToken = async (passwordResetToken: string, passwordResetExpire: string, id: string) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException('ID is invalid')
    }
    return await this.userModel.findByIdAndUpdate(id, {
      passwordResetToken, passwordResetExpire
    })
  }
  async checkResetPasswordToken(passwordResetToken: string) {
    return await this.userModel.findOne({
      passwordResetToken, passwordResetExpire: { $gt: Date.now() }
    })
  }
  async resetPassword(password: string, id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException('ID is invalid')
    }
    return await this.userModel.findByIdAndUpdate(id, {
      password: this.hashPassword(password), passwordResetToken: null, passwordResetExpire: null, passwordChangeAt: Date.now()
    })
  }
}
