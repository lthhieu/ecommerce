import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import mongoose, { Model } from 'mongoose';
import { genSaltSync, hashSync, compareSync } from 'bcrypt';
import crypto from 'crypto'
import { FOUND_EMAIL, INVALID_ID, NOT_USER_BY_ID, RESET_PASSWORD_TOKEN_EXPIRE } from 'src/configs/response.constants';

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
      throw new BadRequestException(FOUND_EMAIL)
    }
    //create
    let createNewUser = await this.userModel.create({
      ...createUserDto,
      password: this.hashPassword(createUserDto.password)
    })
    return {
      _id: createNewUser._id
    }
  }

  async findAll() {
    return await this.userModel.find().select('-password -refreshToken')
  }

  async findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException(INVALID_ID)
    }
    const user = await this.userModel.findOne({ _id: id }).select('-password -refreshToken')
    if (!user) {
      throw new BadRequestException(NOT_USER_BY_ID)
    }
    return user
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException(INVALID_ID)
    }
    const { email } = updateUserDto
    const user = await this.findOneByEmail(email)
    //check unique email
    if (user && JSON.stringify(user._id) !== JSON.stringify(id)) {
      throw new BadRequestException(FOUND_EMAIL)
    }
    const userUpd = await this.userModel.findOneAndUpdate({ _id: id }, updateUserDto)
    if (!userUpd) {
      throw new BadRequestException(NOT_USER_BY_ID)
    }
    return { _id: userUpd._id }
  }

  async remove(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException(INVALID_ID)
    }
    const userDel = await this.userModel.findOneAndDelete({ _id: id })
    if (!userDel) {
      throw new BadRequestException(NOT_USER_BY_ID)
    }
    return { _id: userDel._id }
  }
  updateRefreshToken = async (refreshToken: string, id: string) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException(INVALID_ID)
    }
    return await this.userModel.findByIdAndUpdate(id, {
      refreshToken
    })
  }
  updatePasswordToken = async (passwordResetToken: string, passwordResetExpire: string, id: string) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException(INVALID_ID)
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
  async resetPassword(token: string, password: string) {
    const passwordResetToken = crypto.createHash('sha256').update(token).digest('hex');
    const checkToken = await this.checkResetPasswordToken(passwordResetToken)
    if (!checkToken) throw new BadRequestException(RESET_PASSWORD_TOKEN_EXPIRE)
    if (!mongoose.Types.ObjectId.isValid(checkToken._id)) {
      throw new BadRequestException(INVALID_ID)
    }
    return await this.userModel.findByIdAndUpdate(checkToken._id, {
      password: this.hashPassword(password), passwordResetToken: null, passwordResetExpire: null, passwordChangeAt: Date.now()
    }).select('_id')
  }
}
